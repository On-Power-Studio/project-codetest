// ============================================================
//  AXIOM AI Service — Unified provider abstraction
//  Supports: OpenAI, Anthropic, Gemini, Ollama, LM Studio, Custom
// ============================================================

export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'lmstudio' | 'custom';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onDone: (fullText: string) => void;
  onError: (error: string) => void;
}

export interface ConnectionTestResult {
  ok: boolean;
  latencyMs?: number;
  model?: string;
  error?: string;
}

// ── Provider model lists ──────────────────────────────────────
export const PROVIDER_MODELS: Record<AIProvider, string[]> = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
  anthropic: [
    'claude-3-5-sonnet-20241022',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ],
  gemini: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
  ollama: ['llama3.2', 'llama3.1', 'mistral', 'codellama', 'deepseek-coder', 'phi3', 'qwen2.5-coder'],
  lmstudio: ['local-model'],
  custom: [],
};

export const PROVIDER_DEFAULTS: Record<AIProvider, Partial<AIConfig>> = {
  openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o' },
  anthropic: { baseUrl: 'https://api.anthropic.com', model: 'claude-3-5-sonnet-20241022' },
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta', model: 'gemini-1.5-flash' },
  ollama: { baseUrl: 'http://localhost:11434', model: 'llama3.2', apiKey: '' },
  lmstudio: { baseUrl: 'http://localhost:1234/v1', model: 'local-model', apiKey: '' },
  custom: { baseUrl: 'http://localhost:8080/v1', model: 'model' },
};

// ── Main send function ────────────────────────────────────────
export async function sendAIMessage(
  messages: AIMessage[],
  config: AIConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  try {
    switch (config.provider) {
      case 'openai':
      case 'lmstudio':
      case 'custom':
        return await sendOpenAICompatible(messages, config, callbacks);
      case 'anthropic':
        return await sendAnthropic(messages, config, callbacks);
      case 'gemini':
        return await sendGemini(messages, config, callbacks);
      case 'ollama':
        return await sendOllama(messages, config, callbacks);
      default:
        callbacks.onError('Unknown provider');
    }
  } catch (err: any) {
    callbacks.onError(err?.message ?? 'Unknown error');
  }
}

// ── OpenAI / LM Studio / Custom (OpenAI-compatible) ──────────
async function sendOpenAICompatible(
  messages: AIMessage[],
  config: AIConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  const url = `${config.baseUrl.replace(/\/$/, '')}/chat/completions`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: true,
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens ?? 2048,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`OpenAI API error ${resp.status}: ${errText.slice(0, 200)}`);
  }

  await readSSEStream(resp, (data) => {
    if (data === '[DONE]') return;
    try {
      const parsed = JSON.parse(data);
      const delta = parsed?.choices?.[0]?.delta?.content;
      if (delta) callbacks.onChunk(delta);
    } catch { /* ignore parse errors */ }
  }, callbacks);
}

// ── Anthropic Claude ─────────────────────────────────────────
async function sendAnthropic(
  messages: AIMessage[],
  config: AIConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  const systemMsg = messages.find(m => m.role === 'system')?.content ?? '';
  const userMessages = messages.filter(m => m.role !== 'system');

  const url = `${config.baseUrl.replace(/\/$/, '')}/v1/messages`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens ?? 2048,
      system: systemMsg,
      messages: userMessages.map(m => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Anthropic API error ${resp.status}: ${errText.slice(0, 200)}`);
  }

  await readSSEStream(resp, (data) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'content_block_delta') {
        const delta = parsed?.delta?.text;
        if (delta) callbacks.onChunk(delta);
      }
    } catch { /* ignore */ }
  }, callbacks);
}

// ── Google Gemini ─────────────────────────────────────────────
async function sendGemini(
  messages: AIMessage[],
  config: AIConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  const url = `${config.baseUrl.replace(/\/$/, '')}/models/${config.model}:streamGenerateContent?key=${config.apiKey}&alt=sse`;

  // Convert to Gemini format
  const geminiMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const systemContent = messages.find(m => m.role === 'system')?.content;

  const body: any = {
    contents: geminiMessages,
    generationConfig: {
      temperature: config.temperature ?? 0.7,
      maxOutputTokens: config.maxTokens ?? 2048,
    },
  };
  if (systemContent) {
    body.systemInstruction = { parts: [{ text: systemContent }] };
  }

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini API error ${resp.status}: ${errText.slice(0, 200)}`);
  }

  await readSSEStream(resp, (data) => {
    try {
      const parsed = JSON.parse(data);
      const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) callbacks.onChunk(text);
    } catch { /* ignore */ }
  }, callbacks);
}

// ── Ollama ────────────────────────────────────────────────────
async function sendOllama(
  messages: AIMessage[],
  config: AIConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  const url = `${config.baseUrl.replace(/\/$/, '')}/api/chat`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: true,
      options: { temperature: config.temperature ?? 0.7 },
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Ollama error ${resp.status}: ${errText.slice(0, 200)}`);
  }

  // Ollama streams as newline-delimited JSON (not SSE)
  const reader = resp.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let full = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const parsed = JSON.parse(trimmed);
        const token = parsed?.message?.content;
        if (token) {
          full += token;
          callbacks.onChunk(token);
        }
        if (parsed?.done) {
          callbacks.onDone(full);
          return;
        }
      } catch { /* ignore */ }
    }
  }
  callbacks.onDone(full);
}

// ── SSE stream reader (shared by OpenAI / Anthropic / Gemini) ─
async function readSSEStream(
  resp: Response,
  onData: (data: string) => void,
  callbacks: StreamCallbacks
): Promise<void> {
  const reader = resp.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let full = '';
  let buffer = '';

  const origOnChunk = callbacks.onChunk;
  callbacks = {
    ...callbacks,
    onChunk: (text) => {
      full += text;
      origOnChunk(text);
    },
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        onData(data);
      }
    }
  }

  callbacks.onDone(full);
}

// ── Connection test ───────────────────────────────────────────
export async function testAIConnection(config: AIConfig): Promise<ConnectionTestResult> {
  const t0 = Date.now();
  try {
    if (config.provider === 'ollama') {
      return await testOllamaConnection(config);
    }
    if (config.provider === 'lmstudio') {
      return await testOpenAICompatibleConnection(config);
    }

    // Send a minimal message and check we get a response chunk
    let resolved = false;
    const result = await new Promise<ConnectionTestResult>((resolve) => {
      const timeout = setTimeout(() => {
        if (!resolved) resolve({ ok: false, error: 'Timeout after 8s' });
      }, 8000);

      sendAIMessage(
        [
          { role: 'user', content: 'Reply with only: ok' },
        ],
        { ...config, maxTokens: 8 },
        {
          onChunk: () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              resolve({ ok: true, latencyMs: Date.now() - t0, model: config.model });
            }
          },
          onDone: () => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              resolve({ ok: true, latencyMs: Date.now() - t0, model: config.model });
            }
          },
          onError: (err) => {
            resolved = true;
            clearTimeout(timeout);
            resolve({ ok: false, error: err });
          },
        }
      );
    });
    return result;
  } catch (err: any) {
    return { ok: false, error: err?.message ?? 'Connection failed' };
  }
}

async function testOllamaConnection(config: AIConfig): Promise<ConnectionTestResult> {
  const t0 = Date.now();
  try {
    const resp = await fetch(`${config.baseUrl.replace(/\/$/, '')}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!resp.ok) return { ok: false, error: `HTTP ${resp.status}` };
    const data = await resp.json();
    const models: string[] = (data.models ?? []).map((m: any) => m.name);
    return { ok: true, latencyMs: Date.now() - t0, model: models[0] ?? 'unknown' };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? 'Cannot reach Ollama. Is it running?' };
  }
}

async function testOpenAICompatibleConnection(config: AIConfig): Promise<ConnectionTestResult> {
  const t0 = Date.now();
  try {
    const url = `${config.baseUrl.replace(/\/$/, '')}/models`;
    const headers: Record<string, string> = {};
    if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;
    const resp = await fetch(url, { headers, signal: AbortSignal.timeout(5000) });
    if (!resp.ok) return { ok: false, error: `HTTP ${resp.status}` };
    return { ok: true, latencyMs: Date.now() - t0, model: config.model };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? 'Connection failed' };
  }
}

// ── Fetch available Ollama models ─────────────────────────────
export async function fetchOllamaModels(baseUrl: string): Promise<string[]> {
  try {
    const resp = await fetch(`${baseUrl.replace(/\/$/, '')}/api/tags`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data.models ?? []).map((m: any) => m.name as string);
  } catch {
    return [];
  }
}

// ── System prompt builder (injects project context) ──────────
export function buildSystemPrompt(projectContext?: string): string {
  const base = `You are AXIOM AI, an expert software engineering assistant specialized in code analysis, test generation, architecture review, and quality assurance.

Your capabilities:
- Deep codebase analysis and architecture understanding
- Generating comprehensive test suites (Playwright, Jest, Vitest, pytest)
- Identifying bugs, security vulnerabilities, and performance issues
- Explaining complex code flows in clear, structured ways
- Suggesting refactoring and best practices

Always provide:
- Concise, actionable insights
- Real code examples when relevant
- Structured responses with clear sections
- Risk assessments when analyzing changes`;

  if (projectContext) {
    return `${base}\n\n## Current Project Context\n${projectContext}`;
  }
  return base;
}

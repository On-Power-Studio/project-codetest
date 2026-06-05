import React, { useState } from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { Workspace3_IntelligenceGraph } from './Workspace3_IntelligenceGraph';
import Editor from '@monaco-editor/react';
import { 
  Play, CheckCircle, HelpCircle, AlertCircle, Search, 
  ChevronDown, ArrowRight, PlayCircle, Globe, Terminal, Code
} from 'lucide-react';

export const Workspace_Explorer: React.FC = () => {
  const { selectedFile, openFiles, closeFile, openFile } = useAxiomStore();
  const [editorTheme, setEditorTheme] = useState('vs-dark');

  // Map file contents
  const fileContents: Record<string, string> = {
    'checkout.spec.ts': `import { test, expect } from '@playwright/test';

test('Happy Path - Valid Order', async ({ page }) => {
  await page.goto('/checkout');
  await page.fill('[data-testid="email"]', 'john.doe@example.com');
  await page.fill('[data-testid="address"]', '123 Main St, New York, NY');
  await page.click('[data-testid="payment-method-card"]');
  await page.fill('[data-testid="card-number"]', '4242 4242 4242 4242');
  await page.fill('[data-testid="expiry"]', '12/28');
  await page.fill('[data-testid="cvc"]', '123');
  await page.click('text=Place Order');
  
  await expect(page.locator('[data-testid="success"]')).toBeVisible();
  await expect(page.locator('[data-testid="order-id"]')).toHaveText(/ORD-\\d+/);
});`,
    'orders.controller.ts': `import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { validateOrderSchema } from '../validation/order';

export async function createOrder(req: Request, res: Response) {
  const { error, value } = validateOrderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const order = await OrderService.create(value);
    return res.status(201).json(order);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}`,
    'schema.prisma': `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  orders Order[]
}

model Order {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  total     Float
  createdAt DateTime @default(now())
}`
  };

  const code = fileContents[selectedFile] || '// Select a file from the explorer to edit';

  return (
    <div className="flex-1 bg-bg-primary flex flex-col h-full min-h-0 select-none overflow-hidden font-sans">
      
      {/* Top Split Pane: Sized 3/5 height (renders mini Intelligence Graph) */}
      <div className="h-[55%] border-b border-border-color min-h-0 flex flex-col">
        <div className="px-3.5 py-1.5 border-b border-border-color bg-surface/10 text-[10px] font-bold text-text-secondary tracking-widest uppercase flex items-center justify-between shrink-0">
          <span>Integrated Intelligence Graph</span>
        </div>
        <div className="flex-1 min-h-0">
          <Workspace3_IntelligenceGraph />
        </div>
      </div>

      {/* Bottom Split Pane: Sized 2/5 height (split into three columns) */}
      <div className="h-[45%] grid grid-cols-12 gap-3 p-3 min-h-0">
        
        {/* Column 1: Test Explorer (Width 2/12) */}
        <div className="col-span-2 bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 select-none">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2 pb-1 border-b border-border-color/30">Test Explorer</span>
          <div className="relative mb-2 shrink-0">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary" />
            <input type="text" placeholder="Search tests..." className="w-full bg-surface border border-border-color rounded px-2 pl-7 py-1 text-[9px] text-text-primary focus:outline-none" />
          </div>
          <div className="flex-1 overflow-y-auto pr-1 text-[10px] space-y-1">
            <div className="font-semibold text-text-primary flex items-center space-x-1"><ChevronDown className="h-3 w-3" /><span>Checkout Flow</span></div>
            <div className="pl-4 space-y-1.5 text-text-secondary mt-1 font-medium">
              <div className="flex items-center justify-between text-text-primary font-semibold"><span className="truncate">Happy Path - Valid Order</span><span className="text-success text-[12px]">●</span></div>
              <div className="flex items-center justify-between"><span>Empty Cart</span><span className="text-success text-[12px]">●</span></div>
              <div className="flex items-center justify-between"><span>Invalid Payment Method</span><span className="text-danger text-[12px]">●</span></div>
              <div className="flex items-center justify-between"><span>Expired Card</span><span className="text-danger text-[12px]">●</span></div>
              <div className="flex items-center justify-between"><span>Insufficient Funds</span><span className="text-warning text-[12px]">●</span></div>
              <div className="flex items-center justify-between"><span>Coupon Applied</span><span className="text-success text-[12px]">●</span></div>
            </div>
          </div>
        </div>

        {/* Column 2: Code Editor (Width 5/12) */}
        <div className="col-span-5 bg-surface/30 border border-border-color rounded-xl flex flex-col min-h-0 select-text overflow-hidden">
          {/* Tabs bar */}
          <div className="flex bg-surface/10 border-b border-border-color overflow-x-auto shrink-0 select-none">
            {openFiles.map(file => (
              <div
                key={file}
                onClick={() => openFile(file)}
                className={`px-3 py-1.5 border-r border-border-color text-[10px] font-mono flex items-center space-x-2.5 cursor-pointer ${
                  selectedFile === file 
                    ? 'bg-surface text-primary-purple border-t-2 border-t-primary-purple font-bold' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>{file}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(file);
                  }}
                  className="hover:text-danger font-bold text-[8px] cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          {/* Monaco Editor Component */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              defaultLanguage="typescript"
              theme="vs-dark"
              value={code}
              options={{
                readOnly: false,
                fontSize: 10,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollbar: { vertical: 'visible', horizontal: 'visible' },
                padding: { top: 8 }
              }}
            />
          </div>
        </div>

        {/* Column 3: Split Test Runner & Web Browser mockup (Width 5/12) */}
        <div className="col-span-5 bg-surface/30 border border-border-color rounded-xl p-3 flex flex-col min-h-0 select-none">
          <div className="flex justify-between items-center text-[10px] text-text-secondary mb-2 shrink-0 border-b border-border-color/30 pb-1">
            <span className="font-bold uppercase tracking-wider">Test Runner / Preview</span>
            <span className="font-mono text-[9px] text-success bg-success/15 border border-success/35 px-1 rounded">Passed / Run #1247</span>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
            {/* Test runner step details */}
            <div className="flex flex-col min-h-0 border-r border-border-color/20 pr-1.5">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Logs</span>
              <div className="flex-1 overflow-y-auto space-y-1.5 text-[9.5px] font-mono text-text-secondary leading-normal">
                <div className="flex items-center space-x-1.5"><CheckCircle className="h-3 w-3 text-success shrink-0" /><span className="text-text-primary">Navigate to /checkout 1.2s</span></div>
                <div className="flex items-center space-x-1.5"><CheckCircle className="h-3 w-3 text-success shrink-0" /><span className="text-text-primary">Fill checkout info 2.4s</span></div>
                <div className="flex items-center space-x-1.5"><CheckCircle className="h-3 w-3 text-success shrink-0" /><span className="text-text-primary">Validate cart items 0.8s</span></div>
                <div className="flex items-center space-x-1.5"><CheckCircle className="h-3 w-3 text-success shrink-0" /><span className="text-text-primary">Process payment 8.7s</span></div>
                <div className="flex items-center space-x-1.5"><CheckCircle className="h-3 w-3 text-success shrink-0" /><span className="text-text-primary">Create order 1.1s</span></div>
                <div className="flex items-center space-x-1.5"><CheckCircle className="h-3 w-3 text-success shrink-0" /><span className="text-text-primary">Update inventory 0.9s</span></div>
              </div>
            </div>

            {/* Web preview mock visual rendering */}
            <div className="flex flex-col min-h-0">
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Browser</span>
              <div className="flex-1 bg-white border border-border-color rounded p-2 text-black text-[9px] leading-tight select-text overflow-y-auto flex flex-col justify-between">
                <div>
                  <div className="border-b border-gray-200 pb-1 font-bold text-gray-800">Axiom Checkout</div>
                  <div className="space-y-1 mt-1.5 text-gray-500 font-sans">
                    <div>Email: john.doe@example.com</div>
                    <div>Address: 123 Main St, New York</div>
                    <div>Payment: Visa Card 4242</div>
                    <div className="font-bold text-gray-700 mt-1">Total: $152.98</div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 text-green-700 p-1.5 rounded mt-2 text-[8px] font-medium leading-normal shrink-0">
                  <div className="font-bold">Order placed successfully!</div>
                  <div>Your order ID is ORD-82734</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

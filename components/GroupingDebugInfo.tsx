"use client";

import { useState } from "react";
import { GroupedProduct } from "@/lib/product-grouping";
import { ChevronDown, ChevronUp } from "lucide-react";

interface GroupingDebugInfoProps {
  groupedProducts: GroupedProduct[];
}

export default function GroupingDebugInfo({
  groupedProducts,
}: GroupingDebugInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Find test products
  const testProduct1 = groupedProducts.find((p) => p.baseId === "10.182");
  const testProduct2 = groupedProducts.find((p) => p.baseId === "10182");

  // Get some sample grouped products
  const sampleProducts = groupedProducts.slice(0, 5);

  return (
    <div className="mb-4 border border-blue-500 bg-blue-50 rounded-lg p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full text-left font-semibold text-blue-900"
      >
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        Debug: Informacije o grupisanju proizvoda
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 text-sm">
          <div>
            <p className="font-semibold text-blue-900">
              Ukupno grupisanih proizvoda: {groupedProducts.length}
            </p>
          </div>

          {/* Test product 10.182 (with dots) */}
          {testProduct1 && (
            <div className="bg-white p-3 rounded border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                Test proizvod 1: {testProduct1.name} (Bazna šifra: {testProduct1.baseId})
              </h4>
              <div className="space-y-1 text-xs">
                <p className="text-gray-700">
                  Broj varijanti: <span className="font-mono font-bold">{testProduct1.variants.length}</span>
                </p>
                <div className="mt-2">
                  <p className="font-semibold text-gray-700 mb-1">Sve varijante:</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {testProduct1.variants.slice(0, 10).map((variant) => (
                      <div
                        key={variant.id}
                        className="font-mono text-xs bg-gray-50 p-2 rounded border border-gray-200"
                      >
                        <span className="font-semibold">{variant.id}</span>
                        {variant.color && (
                          <span className="ml-2 text-gray-600">
                            - Boja: {variant.color.name}
                          </span>
                        )}
                        {variant.size && (
                          <span className="ml-2 text-gray-600">
                            - Veličina: {variant.size.name}
                          </span>
                        )}
                      </div>
                    ))}
                    {testProduct1.variants.length > 10 && (
                      <p className="text-gray-500 text-xs">
                        ... i {testProduct1.variants.length - 10} više varijanti
                      </p>
                    )}
                  </div>
                </div>
                {testProduct1.availableColors.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold text-gray-700">Dostupne boje ({testProduct1.availableColors.length}):</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {testProduct1.availableColors.slice(0, 10).map((color) => (
                        <span
                          key={color.id}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {color.name}
                        </span>
                      ))}
                      {testProduct1.availableColors.length > 10 && (
                        <span className="text-xs text-gray-500">
                          +{testProduct1.availableColors.length - 10} više
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Test product 10182 (without dots) */}
          {testProduct2 && (
            <div className="bg-white p-3 rounded border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">
                Test proizvod 2: {testProduct2.name} (Bazna šifra: {testProduct2.baseId})
              </h4>
              <div className="space-y-1 text-xs">
                <p className="text-gray-700">
                  Broj varijanti: <span className="font-mono font-bold">{testProduct2.variants.length}</span>
                </p>
                <div className="mt-2">
                  <p className="font-semibold text-gray-700 mb-1">Sve varijante:</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {testProduct2.variants.slice(0, 10).map((variant) => (
                      <div
                        key={variant.id}
                        className="font-mono text-xs bg-gray-50 p-2 rounded border border-gray-200"
                      >
                        <span className="font-semibold">{variant.id}</span>
                        {variant.color && (
                          <span className="ml-2 text-gray-600">
                            - Boja: {variant.color.name}
                          </span>
                        )}
                        {variant.size && (
                          <span className="ml-2 text-gray-600">
                            - Veličina: {variant.size.name}
                          </span>
                        )}
                      </div>
                    ))}
                    {testProduct2.variants.length > 10 && (
                      <p className="text-gray-500 text-xs">
                        ... i {testProduct2.variants.length - 10} više varijanti
                      </p>
                    )}
                  </div>
                </div>
                {testProduct2.availableColors.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold text-gray-700">Dostupne boje ({testProduct2.availableColors.length}):</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {testProduct2.availableColors.slice(0, 10).map((color) => (
                        <span
                          key={color.id}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                        >
                          {color.name}
                        </span>
                      ))}
                      {testProduct2.availableColors.length > 10 && (
                        <span className="text-xs text-gray-500">
                          +{testProduct2.availableColors.length - 10} više
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!testProduct1 && !testProduct2 && (
            <div className="bg-yellow-50 p-3 rounded border border-yellow-300">
              <p className="text-yellow-800 font-semibold">
                ⚠️ Test proizvodi sa baznom šifrom &quot;10.182&quot; ili &quot;10182&quot; nisu pronađeni!
              </p>
            </div>
          )}

          {/* Sample products */}
          <div className="bg-white p-3 rounded border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">
              Primeri grupisanja (prvih 5):
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {sampleProducts.map((product) => (
                <div
                  key={product.baseId}
                  className="bg-gray-50 p-2 rounded border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-mono text-xs font-semibold text-blue-900">
                        {product.baseId}
                      </p>
                      <p className="text-xs text-gray-600">{product.name}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {product.variants.length} varijanti
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {product.variants.slice(0, 3).map((variant) => (
                      <span
                        key={variant.id}
                        className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-300"
                      >
                        {variant.id}
                      </span>
                    ))}
                    {product.variants.length > 3 && (
                      <span className="text-[10px] text-gray-500 px-1.5 py-0.5">
                        +{product.variants.length - 3} više
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

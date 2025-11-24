import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { AllProductContext } from "../../../../../context/ProductContext";

const ProductDetailsLayout = () => {
  const { Product } = useContext(AllProductContext);

  return (
    <div>
      <header aria-label="Site Header" className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 my-5 md:my-10">
          <div className="flex h-16 items-center justify-center">
            <div className="">
              <nav aria-label="Site Nav">
                <ul className=" text-sm md:text-base flex items-center gap-3 md:gap-6">
                  <li>
                    <Link
                      className="text-gray-500 font-semibold transition hover:text-gray-500/75 hover:font-semibold hover:text-zinc-900"
                      to={`/admin/mallProduct/details/${Product?.Model}/afterSales`}
                    >
                      After-sales
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="text-gray-500 font-semibold transition hover:text-gray-500/75 hover:font-semibold hover:text-zinc-900"
                      to={`/admin/mallProduct/details/${Product?.Model}/instruction`}
                    >
                      After-sales Instructions
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="text-gray-500 font-semibold transition hover:text-gray-500/75 hover:font-semibold hover:text-zinc-900"
                      to={`/admin/mallProduct/details/${Product?.Model}/inventory`}
                    >
                      Inventory
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="text-gray-500 font-semibold transition hover:text-gray-500/75 hover:font-semibold hover:text-zinc-900"
                      to={`/admin/mallProduct/details/${Product?.Model}/invoice`}
                    >
                      Invoice
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <Outlet></Outlet>
    </div>
  );
};

export default ProductDetailsLayout;

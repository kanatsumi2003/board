import { useState } from "react";

export const Tab = () => {
  const [active, setActive] = useState(1);

  return (
    <div className="w-full">
      <div className="relative right-0">
        <ul
          className="relative flex list-none flex-wrap rounded-lg bg-gray-100 p-1"
          data-tabs="tabs"
          role="list"
        >
          <li className="z-30 flex-auto text-center">
            <a
              className={`z-30 mb-0 flex w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-inherit px-0 py-1 transition-all ease-in-out ${
                active === 1 ? "bg-white" : ""
              }`}
              data-tab-target=""
              role="tab"
              aria-selected="true"
              onClick={() => setActive(1)}
            >
              <span className="ml-1">Tổng quan đơn hàng</span>
            </a>
          </li>
          <li className="z-30 flex-auto text-center">
            <a
              className={`z-30 mb-0 flex w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-inherit px-0 py-1 transition-all ease-in-out ${
                active === 2 ? "bg-white" : ""
              }`}
              data-tab-target=""
              role="tab"
              aria-selected="false"
              onClick={() => setActive(2)}
            >
              <span className="ml-1">Chi tiết đơn hàng</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

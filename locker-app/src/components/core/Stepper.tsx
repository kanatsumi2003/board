import React from "react";

export interface StepItem {
  icon?: JSX.Element;
  title?: string;
  onClick?: () => void;
}

interface Props {
  steps: StepItem[];
  current: number;
}

function Stepper({ steps, current }: Props) {
  return (
    <ol className="items-center w-full gap-8 flex justify-around font-bold">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center justify-between">
            <li
              onClick={step.onClick}
              className={`flex items-center ${
                current >= index + 1 ? "text-locker-blue" : "text-gray-500"
              }  space-x-4 hover:bg-gray-50 p-4 rounded-lg cursor-pointer`}
            >
              <span
                className={`flex items-center justify-center w-20 h-20 border-2 ${
                  current >= index + 1
                    ? "border-locker-blue"
                    : "border-gray-500"
                } rounded-full shrink-0`}
              >
                {step.icon}
              </span>
              <span>
                <h3 className="leading-tight">{step.title}</h3>
              </span>
            </li>
          </div>
          {index !== steps.length - 1 && (
            <div
              className={`border border-solid  ${
                current >= index + 2 ? "border-locker-blue" : "border-gray-500"
              } w-20`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </ol>
  );
}

export default Stepper;

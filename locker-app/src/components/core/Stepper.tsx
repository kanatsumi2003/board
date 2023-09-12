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
    <ol className="items-center w-full space-y-4 sm:flex sm:space-y-0 justify-around">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center sm:space-y-0 justify-between">
            <li
              onClick={step.onClick}
              className={`flex items-center ${
                current >= index + 1 ? "text-locker-blue" : "text-gray-500"
              }  space-x-2.5 hover:bg-gray-50 p-4 rounded-lg cursor-pointer`}
            >
              <span
                className={`flex items-center justify-center w-20 h-20 text-lg border-2 ${
                  current >= index + 1
                    ? "border-locker-blue"
                    : "border-gray-500"
                } rounded-full shrink-0`}
              >
                {step.icon}
              </span>
              <span>
                <h3 className="font-bold leading-tight text-3xl">
                  {step.title}
                </h3>
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

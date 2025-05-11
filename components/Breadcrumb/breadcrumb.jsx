import React from "react";

const Breadcrumb = (props) => {
  return (
    <div class="pt-4  pb-2 px-4">
      <div className="mt-2 py-3 px-4 bg-gray-2 dark:bg-meta-4 flex flex-col gap-3 rounded-md  sm:flex-row sm:items-center sm:justify-between">
        <h1 class="sm:text-3xl text-2xl  font-extrabold text-primary dark:text-white font-satoshi">
          {props.title}
        </h1>
        <nav>
          <ol class="flex items-center gap-2">
            <li>
              <p class="font-medium font-satoshi ">{props.mainRoute} /</p>
            </li>
            <li class="font-medium text-primary dark:text-secondary font-satoshi">
              {props.subRoute}
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;

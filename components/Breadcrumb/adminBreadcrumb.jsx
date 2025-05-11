import React from "react";

const AdminBreadcrumb = (props) => {
  return (
    <div class="mb-4 ">
      <div className="mt-2 py-2 px-4 bg-gray dark:bg-meta-4 flex flex-col gap-3 rounded-md  sm:flex-row sm:items-center sm:justify-between">
        <h1 class=" text-2xl  font-extrabold text-primary dark:text-white font-satoshi">
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

export default AdminBreadcrumb;

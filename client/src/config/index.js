export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addMenuItemsFormControls = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
     
    ],
  },
  {
    label: "Subcategory",
    name: "subcategory",
    componentType: "select",
    options: [
      
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
];

export const addCategoryFormControls = [
  {
    label: "Category Name",
    name: "name",
    componentType: "input",
    type: "text",
    placeholder: "Enter category name",
  }
];

export const addSubCategoryFormControls = [
  {
    label: "Subcategory Name",
    name: "name",
    componentType: "input",
    type: "text",
    placeholder: "Enter subcategory name",
  }
];

export const addTableFormControls = [
  {
    label: "Table Name",
    name: "tableName",
    componentType: "input",
    type: "text",
    placeholder: "Enter table name",
  },
  {
    label: "Capacity",
    name: "capacity",
    componentType: "input",
    type: "number",
    placeholder: "Enter table capacity",
  },
  {
    label: "Status",
    name: "status",
    componentType: "select",
    options: [
      { id: "1", label: "available" },
      { id: "2", label: "reserved" },
      { id: "3", label: "occupied" },
    ],
  },
  {
    label: "Spaces",
    name: "spaces",
    componentType: "select",
    options: [
      
    ],
  },
];



export const addSpacesFormControls = [
  {
    
    label: "SpaceName",
    name: "SpaceName",
    componentType: "input",
    type: "text",
    placeholder: "Enter space name",
  }
];
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
      { id: "1", label: "Veg" },
      { id: "2", label: "Non-Veg" },
      { id: "3", label: "Dessert" },
      { id: "4", label: "Beverages" },
      { id: "5", label: "Salads" },
    ],
  },
  {
    label: "Subcategory",
    name: "subcategory",
    componentType: "select",
    options: [
      { id: "1", label: "Starters" },
      { id: "2", label: "Main Course" },
      { id: "3", label: "Snacks" },
      { id: "4", label: "Soups" },
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
      { id: "1", label: "1st Floor" },
      { id: "2", label: "2nd Floor" },
      { id: "3", label: "VIP" },
    ],
  },
];


export const addSpacesFormControls = [
  {
    label: "Spaces",
    name: "spaces",
    componentType: "input",
    type: "text",
    placeholder: "Enter spaces name",
  }
];
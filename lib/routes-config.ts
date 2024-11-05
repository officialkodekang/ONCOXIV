// for page navigation & to sort on leftbar

export type EachRoute = {
  title: string;
  href: string;
  noLink?: true;
  items?: EachRoute[];
};

export const ROUTES: EachRoute[] = [
  {
    title: "Getting Started",
    href: "/getting-started",
    noLink: true,
    items: [
      { title: "Introduction", href: "/introduction" },


      { title: "Prerequisites", href: "/Prerequisites" },

      {
        title: "Dataset Download and Preparation",
        href: "/Dataset",
       
      },


      { title: "Import Libraries and Set Device", href: "/Import-Libraries-and-Set-Device" },

    
      {
        title: "Data Preparation",
        href: "/data-preparation",
        
      },
      
      {
        title: "Exploratory Data Analysis (EDA)",
        href: "/Exploratory-Data-Analysis",
       
      },


      {
        title: "Define Dataset and DataLoaders",
        href: "/Define-Dataset-and-DataLoaders",
        // items: [
        //   { title: "Custom Dataset Class", href: "/Custom-Dataset-Class" },
        //   { title: "Data Transformations", href: "/Data-Transformations" },
        //   { title: "Data Loaders", href: "/Data-Loaders" }, 
        // ],
      },


           {
        title: "Model Architecture2",
        href: "/Model-Architecture",
        items: [
          { title: "Resnet50 Model", href: "/Resnet50",
            items: [
              { title: "Model Training", href: "/Model-training" },
              { title: "Model Evaluation", href: "/Model-Evaluation" },
              // { title: "Inference", href: "/Inference" },
            ],
          },

          { title: "VGG Model", href: "/vgg-model",
            items: [
              { title: "Model Training", href: "/vgg-Model-training" },
              { title: "Model Evaluation", href: "/vgg-Model-Evaluation" },
              // { title: "Inference", href: "/vgg-Inference" },
            ],
          },
         
        ],
      },
      


      {
        title: "Comparsion And Conclusion",
        href: "/comparsion-conclusion",
        // items: [
        //   { title: "ResNet50 base model and modifications.", href: "/ResNet50-modifications" },
        //   { title: "Model Modifications", href: "/Model-Modifications" },
        //   { title: "Multitask Learning", href: "/Multitask-Learning" }, 
        //   { title: "Freezing Early Layers", href: "/Freezing-Early-Layers" },
        //   { title: "Forward Pass", href: "/Forward-Pass" }, 
        //   { title: "Overfitting Prevention", href: "/Overfitting-Prevention" }, 

        // ],
      },


      // {
      //   title: "Model Training",
      //   href: "/Model-training",
      //   // items: [
      //   //   { title: "The training process, early stopping, and loss calculations", href: "/training-stopping-calculations" },
      //   //   { title: "Training parameters such as epochs and batch size", href: "/parameters-epochs-batch" },
          
      //   // ],
      // },

      // {
      //   title: "Model Evaluation",
      //   href: "/Model-Evaluation",
      //   // items: [
      //   //   { title: "Plotting training curves to visualize progress.", href: "/Plotting-training-curves" },
      //   //   { title: "Evaluating model performance on the test set", href: "/Evaluating-model-performance" },
      //   //   { title: "Displaying model predictions", href: "/Displaying-model-predictions" }, 
      //   // ],
      // },



      // {
      //   title: "Inference",
      //   href: "/Inference",
      //   // items: [
      //   //   { title: "Making predictions on individual images and visualizing results", href: "/Making-predictions-individual" },
          
      //   // ],
      // },


      // {
      //   title: "Conclusion",
      //   href: "/Conclusion",
      //   items: [
      //     { title: "Summary of the model's performance", href: "/Summary-model-performance" },
          
      //   ],
      // },













      // {
      //   title: "Data Preparation",
      //   href: "/data-preparation",
      //   items: [
      //     { title: "Layouts", href: "/layouts" },
      //     { title: "Integrations", href: "/integrations" },
      //     {
      //       title: "Manual",
      //       href: "/manual",
      //       items: [
      //         { title: "JavaScript", href: "/javascript" },
      //         { title: "Typescript", href: "/typescript" },
      //         { title: "Golang", href: "/golang" },
      //       ],
      //     },
      //   ],
      // },




      // {
      //   title: "FAQ",
      //   href: "/faq",
      // },
    ],
  },
  // {
  //   title: "Server Actions",
  //   href: "/server-actions",
  //   noLink: true,
  //   items: [
  //     { title: "getSession", href: "/getSession" },
  //     { title: "getToken", href: "/getToken" },
  //     { title: "getRole", href: "/getRole" },
  //   ],
  // },


  // {
  //   title: "React Hooks",
  //   href: "/react-hooks",
  //   noLink: true,
  //   items: [
  //     { title: "useSession", href: "/use-session" },
  //     { title: "useFetch", href: "/use-fetch" },
  //     { title: "useAuth", href: "/use-auth" },
  //     { title: "useProduct", href: "/use-product" },
  //     { title: "useOrder", href: "/use-order" },
  //     { title: "useCart", href: "/use-cart" },
  //     { title: "usePayment", href: "/use-payment" },
  //     { title: "useShipping", href: "/use-shipping" },
  //     { title: "useNotification", href: "/use-notification" },
  //     { title: "useReview", href: "/use-review" },
  //     { title: "useInventory", href: "/use-inventory" },
  //     { title: "useUser", href: "/use-user" },
  //     { title: "useSettings", href: "/use-settings" },
  //     { title: "useAnalytics", href: "/use-analytics" },
  //     { title: "useTheme", href: "/use-theme" },
  //     { title: "useRouter", href: "/use-router" },
  //     { title: "useData", href: "/use-data" },
  //   ],
  // },
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();

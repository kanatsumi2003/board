import {
  ActionFunction,
  BrowserRouter,
  LoaderFunction,
  Route,
  Routes,
} from "react-router-dom";
import "react-simple-keyboard/build/css/index.css";
import "./App.css";
import MainLayout from "./layouts/MainLayout";

interface IRoute {
  path: string;
  Element: React.ComponentType<any>;
  loader?: LoaderFunction;
  action?: ActionFunction;
  ErrorBoundary?: JSX.Element;
}

const pages = import.meta.glob("./pages/**/*.tsx", { eager: true });

const routes: IRoute[] = [];
for (const path of Object.keys(pages)) {
  const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
  if (!fileName) {
    continue;
  }

  const normalizedPathName = fileName.includes("$")
    ? fileName.replace("$", ":")
    : fileName.replace(/\/index/, "");

  routes.push({
    path: fileName === "index" ? "/" : `/${normalizedPathName.toLowerCase()}`,
    // @ts-ignore
    Element: pages[path].default,
    // @ts-ignore
    loader: pages[path]?.loader as unknown as LoaderFunction | undefined,
    // @ts-ignore
    action: pages[path]?.action as unknown as ActionFunction | undefined,
    // @ts-ignore
    ErrorBoundary: pages[path]?.ErrorBoundary as unknown as JSX.Element,
  });
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {routes.map(({ Element, ErrorBoundary, ...rest }, index) => {
            return <Route key={index} path={rest.path} element={<Element />} />;
          })}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;

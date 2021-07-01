import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import CategoryPage from "./components/categories/CategoryPage";
import SignUpPage from "./components/signUp/SignUpPage";
import GlobalStyle from "./styles/GlobalStyles";
import SignInPage from "./components/signIn/SignIn";
import UserContext from "./contexts/UserContext";

export default function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({});

  const fetchProducts = useCallback(() => {
    axios
      .get("http://localhost:4000/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        alert("Ocorreu um erro. Tente novamente");
      });
  }, []);

  useEffect(() => {
    fetchProducts();
    const localUser = localStorage.getItem("toysCampUserData");
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, [fetchProducts]);

  return (
    <BrowserRouter>
      <GlobalStyle />
      <Switch>
        <UserContext.Provider value={{ user, setUser }}>
          <Route
            path="/sign-in"
            exact
            render={(props) => <SignInPage {...props} setUser={setUser} />}
          />
          <Route path="/sign-up" exact component={SignUpPage} />
          <Route
            path="/"
            exact
            render={(props) => <HomePage {...props} products={products} />}
          />
          <Route
            path="/releases"
            exact
            render={(props) => (
              <CategoryPage
                {...props}
                products={products}
                category={"Lançamentos"}
              />
            )}
          />
          <Route
            path="/sales"
            exact
            render={(props) => (
              <CategoryPage
                {...props}
                products={products}
                category={"Promoções"}
              />
            )}
          />
        </UserContext.Provider>
      </Switch>
    </BrowserRouter>
  );
}

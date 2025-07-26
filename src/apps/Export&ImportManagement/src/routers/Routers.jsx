import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/user/Login";
import Signup from "../pages/user/Signup";
import PrivateRoute from "../components/PrivateRoute/PrivateRoute";
import AdminRoute from "../components/PrivateRoute/AdminRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import Accounts from "../pages/orders/Accounts";
import Warehouse from "../pages/warehouse/Warehouse";
import Admin from "../pages/admin/Admin";
import Transport from "../pages/dataInput/Transport";
import Import from "../pages/Dashboard/Import";
import TransportRoutes from "../pages/dataInput/TransportRoutes";
import DataInput from "../pages/dataInput/DataInput";
import TransportCountry from "../pages/dataInput/TransportCountry";
import Purchase from "../pages/purchase/Purchase";
import Transportservice from "../pages/Transportservice";
import AddCharges from "../pages/dataInput/AddCharges";
import AddChargesUpdate from "../pages/dataInput/AddChargesUpdate";
import ProductBoxes from "../pages/finance/ProductBoxes";
import Home from "../pages/Home/Home";
import Finance from "../pages/finance/Finance";
import DataInputUpdate from "../pages/dataInput/DataInputUpdate";
import AccountsUpdate from "../pages/orders/AccountsUpdate";
import FinalData from "../pages/finance/FinalData";
import NewProduct from "../pages/dataInput/NewProduct";
import NewBrand from "../pages/dataInput/NewBrand";
import NewProductUpdate from "../pages/dataInput/NewProductUpdate";
import NewBrandUpdate from "../pages/dataInput/NewBrandUpdate";
import PrintingExInitialData from "../pages/PrintingExportInitialData/PrintingExInitialData";
import FinalPurchase from "../pages/FinalPurchase/FinalPurchase";
import FinanceDetails from "../pages/finance/FinanceDetails";
import AddCFLevel from "../pages/dataInput/AddCFLevel";
import PurchaseFinance from "../pages/purchase/PurchaseFinance";
import ProductInBoxCalculation from "../pages/dataInput/ProductInBoxCalculation";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/export-import/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/export-import/dashboard" element={<Dashboard />} />
        <Route path="/export-import/newproduct" element={<NewProduct />} />
        <Route
          path="/export-import/newproduct/:id"
          element={<NewProductUpdate />}
        />
        <Route path="/export-import/newbrand" element={<NewBrand />} />
        <Route
          path="/export-import/newbrand/:id"
          element={<NewBrandUpdate />}
        />
        <Route path="/export-import/import" element={<Import />} />
        <Route path="/export-import/accounts" element={<Accounts />} />
        <Route
          path="/export-import/accounts/:id"
          element={<AccountsUpdate />}
        />
        <Route path="/export-import/warehouse" element={<Warehouse />} />
        <Route path="/export-import/transport" element={<Transport />} />
        <Route
          path="/export-import/transportroutes"
          element={<TransportRoutes />}
        />
        {/* <Route path="/newproduct" element={<NewProduct />} />
        <Route path="/newproduct/:id" element={<NewProductUpdate />} />
        <Route path="/newbrand" element={<NewBrand />} />
        <Route path="/newbrand/:id" element={<NewBrandUpdate />} /> */}
        <Route path="/export-import/AddCAndFLevel" element={<AddCFLevel />} />
        <Route path="/export-import/datainput" element={<DataInput />} />
        <Route
          path="/export-import/datainput/:id"
          element={<DataInputUpdate />}
        />
        <Route
          path="/export-import/transportcountry"
          element={<TransportCountry />}
        />
        <Route
          path="/export-import/printInitialData"
          element={<PrintingExInitialData />}
        />
        <Route path="/export-import/export" element={<Purchase />} />
        <Route
          path="/export-import/exportAndFinance"
          element={<PurchaseFinance />}
        />
        <Route path="/export-import/finalExport" element={<FinalPurchase />} />
        <Route
          path="/export-import/transportservice"
          element={<Transportservice />}
        />
        <Route path="/export-import/addcharges" element={<AddCharges />} />
        <Route
          path="/export-import/addcharges/:id"
          element={<AddChargesUpdate />}
        />
        <Route
          path="/export-import/productinboxes"
          element={<ProductBoxes />}
        />
        <Route
          path="/export-import/addProductInBoxValue"
          element={<ProductInBoxCalculation />}
        />
        <Route path="/export-import/finance" element={<Finance />} />
        <Route
          path="/export-import/export-details/:id"
          element={<FinanceDetails />}
        />
        <Route
          path="/export-import/finance-details/:id"
          element={<FinanceDetails />}
        />
        <Route path="/export-import/finaldata" element={<FinalData />} />
        <Route
          path="/export-import/finalData-details/:id"
          element={<FinanceDetails />}
        />
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/export-import/dashboard" element={<Dashboard />} />
        <Route path="/export-import/admin" element={<Admin />} />
        <Route path="/export-import/signup" element={<Signup />} />
      </Route>
    </Routes>
  );
};

export default Routers;

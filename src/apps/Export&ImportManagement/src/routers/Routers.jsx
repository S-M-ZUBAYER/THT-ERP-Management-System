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
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/newproduct" element={<NewProduct />} />
        <Route path="/newproduct/:id" element={<NewProductUpdate />} />
        <Route path="/newbrand" element={<NewBrand />} />
        <Route path="/newbrand/:id" element={<NewBrandUpdate />} />
        <Route path="/import" element={<Import />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/accounts/:id" element={<AccountsUpdate />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/transportroutes" element={<TransportRoutes />} />
        <Route path="/AddCAndFLevel" element={<AddCFLevel />} />
        <Route path="/datainput" element={<DataInput />} />
        <Route path="/datainput/:id" element={<DataInputUpdate />} />
        <Route path="/transportcountry" element={<TransportCountry />} />
        <Route path="/printInitialData" element={<PrintingExInitialData />} />
        <Route path="/export" element={<Purchase />} />
        <Route path="/exportAndFinance" element={<PurchaseFinance />} />
        <Route path="/finalExport" element={<FinalPurchase />} />
        <Route path="/transportservice" element={<Transportservice />} />
        <Route path="/addcharges" element={<AddCharges />} />
        <Route path="/addcharges/:id" element={<AddChargesUpdate />} />
        <Route path="/productinboxes" element={<ProductBoxes />} />
        <Route
          path="/addProductInBoxValue"
          element={<ProductInBoxCalculation />}
        />
        <Route path="/finance" element={<Finance />} />
        <Route path="/export-details/:id" element={<FinanceDetails />} />
        <Route path="/finance-details/:id" element={<FinanceDetails />} />
        <Route path="/finaldata" element={<FinalData />} />
        <Route path="/finalData-details/:id" element={<FinanceDetails />} />
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
};

export default Routers;

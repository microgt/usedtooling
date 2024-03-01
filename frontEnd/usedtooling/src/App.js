import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Home from './Home.js';
import Contact from './Contact.js';
import Store from './Store.js';
import Product from './Product';
import Equipment from './Equipment.js';
import AddEquipment from './AddEquipment.js';
import EquipmentView from './EquipmentView.js';
import EditEquipment from './EditEquipment.js';
import LoginForm from './LoginForm.js';
import Users from './Users.js';
import UserView from './UserView.js';
import AddUser from './AddUser.js';
import Views from './Views.js';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/store' element={<Store />} />
        <Route path='/product' element={<Product />} />
        <Route path='/equipment' element={<Equipment />} />
        <Route path='/addequipment' element={<AddEquipment/>} />
        <Route path='/editequipment' element={<EditEquipment/>} />
        <Route path='/equipmentview' element={<EquipmentView />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/users' element={<Users/>} />
        <Route path='/userview' element={<UserView/>} />
        <Route path='/adduser' element={<AddUser />} />
        <Route path='/views' element={<Views />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

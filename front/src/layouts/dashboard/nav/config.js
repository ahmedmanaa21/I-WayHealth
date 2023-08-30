// component
import { FaFileSignature } from 'react-icons/fa';
import { MdLocalPharmacy }  from 'react-icons/md';
import { GiMedicinePills } from 'react-icons/gi';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Medicaments',
    path: '/dashboard/medicaments',
    icon: <GiMedicinePills/>,
  },
  {
    title: 'Reimbursment File',
    path: '/dashboard/dossier',
    icon: <FaFileSignature />,
  },
  {
    title: 'Consultation',
    path: '/dashboard/consultation',
    icon: <MdLocalPharmacy />,
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;

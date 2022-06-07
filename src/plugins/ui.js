import Vue from 'vue'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Carousel,
  CarouselItem,
  Switch,
  Tooltip,
  Popover,
  Collapse,
  CollapseItem,
  Message,
  MessageBox,
  Row,
  Col,
  Divider,
  Input,
  Icon,
  Card,
  Form,
  FormItem,
  Dialog,
  Progress,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Notification,
  RadioGroup,
  Radio,
  Checkbox,
  Select, Option,
  DatePicker,
  Loading,
  Skeleton,
  SkeletonItem
} from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import '../styles/element-variables.sass'

Vue.use(Button);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Switch);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Tooltip);
Vue.use(Row);
Vue.use(Col);
Vue.use(Divider);
Vue.use(Icon);
Vue.use(Card);
Vue.use(Popover);
Vue.use(Dialog);
Vue.use(Progress);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItemGroup);
Vue.use(MenuItem);
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Loading);
Vue.use(Skeleton);
Vue.use(SkeletonItem);
locale.use(lang);

Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;

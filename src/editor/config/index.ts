import plugins from './plugins';
import schema from './schema';

export const options = {
  schema,
  plugins,
};

export { default as menu, IMenuItemSpecJSX, IMenu } from './menu';

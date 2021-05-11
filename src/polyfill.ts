import { format } from 'date-fns';

Date.prototype.toJSON = function () {
  return format(this, 'YYYY-MM-DD HH:mm:ss');
};

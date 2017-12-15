import decamelizeKeys from 'decamelize-keys';

import * as pseudoClasses from './pseudo-classes/';

export default decamelizeKeys(pseudoClasses, '-');

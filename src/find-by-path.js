import inspect from './inspect';

export default function findByPath(object, path, createPathIfEmpty) {
   if (!path) {
      return {
          result: object,
          path: null
      };
   }

   if (path in object) {
       return {
         result: object,
         path: path
       };
   }

   var parts = path.split('.');
   var walker = object;

   for(var i = 0; i < parts.length - 1; i++) {
      var part = parts[i];

      if (!(part in walker)) {
        if (!createPathIfEmpty) {
            return {
               result: walker,
               path: null
            };
        } else {
            walker[part] = {};
        }
     }

      if (i < parts.length - 2 && !inspect.isObject(walker[part])) {
          var partName = parts.slice(0, i).join('.');
          throw new Error('Cannot traverse data in path ' + partName + ' since part of it is not an object.');
      }

      walker = walker[part];
   }

   return {
      result: walker,
      path: parts[parts.length - 1]
   };
}

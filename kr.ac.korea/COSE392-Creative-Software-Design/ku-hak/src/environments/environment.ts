// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    firebase: {
        apiKey: 'AIzaSyDSw5ub3385CvQRdrbQZPqHmyz0MAxRPLw',
        authDomain: 'ku-hak.firebaseapp.com',
        databaseURL: 'https://ku-hak.firebaseio.com',
        projectId: 'ku-hak',
        storageBucket: 'ku-hak.appspot.com',
        messagingSenderId: '118643550231',
    },
    publicVapidKey: 'BMtf6inXoJ2DKat8-r-ByAqDuQTeA-OLVHecmNj8RhLz4yYtGtnRc_6eEhrafc901-E-rNxOELZQnoZgk6j8MT0',
    url: 'http://localhost:4200',
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.

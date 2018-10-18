// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { NgxLoggerLevel } from "ngx-logger";
export const environment = {
  production: false,
  envName: "prod",
  services: {
    campaigns: "http://localhost:8081/SpringMVC-REST"
    
},
pagination: {
  defaultPageSize: 15,
},

defaultLanguage: 'fr_FR',
languages: [
    {
        key: 'fr_FR',
        label: 'LANGUAGE_FRENCH_FRANCE'
    },
    {
        key: 'en_US',
        label: 'LANGUAGE_ENGLISH_UNITED_STATES'
    }
],
defaultCancelNotificationLifeTime: 5000,
};

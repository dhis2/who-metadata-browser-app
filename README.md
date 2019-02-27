## WHO Metadata App By Joakim Melseth (Abaris) ##
(starting point: dhis2 app-skeleton https://github.com/dhis2/app-skeleton)

## Quickstart ##

1. Download WHOBrowser.zip from the release section.
2. Specify the WHO-settings in the the file runtimeConfig.json (see configuration below). This file is located in the root directory of the zip file (i.e, the zip-file needs to be unzipped and rezipped if this is to be changed)
3. Upload the zip-file to your DHIS-instance. 

### Configuration ###

whoDataJson (string): The absolute or relative path to the JSON-file containing the who data. If language dependent files are to be used, see "useLocale" below.

useLocale (boolean): If set to true, the app will look for an language dependent file based on the users database language. The abbreviation for locale's is used in the request. The fallback is "en".
Example: setting "whoDataJson" to "data/whoData.json" and "useLocale" to true will request the file "data/whoData_[locale].json where [locale] is the users database language (the request for the english file calculates to "data/whoData_en.json).

aboutWHOreferences (string): Contents for the "about WHO reference indicators" popup.

## Build on your own ##

### Prerequisites
Make sure you have at least the following versions of `node` and `npm`.

+ Node version v5.6.0 or higher
+ npm version 3.8.0 or higher

Use the following commands to check your current versions
```sh
node -v

npm -v
```

### Getting started

Clone the repository from github with the following command
```sh
git clone https://github.com/dhis2/data-dictionary-app-who.git
```

Install the node dependencies
```sh
npm install
```

To set up your DHIS2 instance to work with the development service you will need to add the development servers address to the CORS whitelist. You can do this within the DHIS2 System Settings app under the _access_ tab. On the access tab add `http://localhost:8081` to the CORS Whitelist.
> The app assumes your dhis2 instance is located at `http://localhost:8080` and that you have an account available with username `admin` and password `district`. If this is not the case, you can add a configuration file (plain text file) to the directory exposed by the DHIS2_HOME environment variable.

This should allow you to be able to run the following node commands

To run the development server
```sh
npm start
```

To build the app (a zip file will be created in the buildzip directory)
```sh
npm run build
```



## License
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.

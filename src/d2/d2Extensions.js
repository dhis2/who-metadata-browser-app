/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */

import Api from 'd2/lib/api/Api';
import apiHelper from '../helpers/apiHelper';

class RequesterBase {
    constructor(logger) {
        this.logger = logger;
        this.api = Api.getApi();
    }

    logit(message) {
        if (this.logger) {
            this.logger.debug(message);
        }
    }

}

class FormulaRequester extends RequesterBase {
    constructor(logger) {
        super(logger);
    }
    get(exprFormula) {
        const api = this.api;
        return api.get('expressions/description', { expression: this.wrapElements(exprFormula) })
        .then((result) => {
            if (apiHelper.isSuccess(result)) {
                return result.description;
            }
            return 'INDICATOR FORMULA IS INVALID';
        })
        .catch((error) => {
            this.logit(JSON.stringify(error));
            return Promise.reject(error);
        });
    }

    wrapElements(exprFormula) {
        if (!exprFormula || exprFormula.length === 0) {
            this.logit(`error in formula ${exprFormula}`);
            return '[]';
        }

        if (exprFormula === '1') {
            return exprFormula;
        }

        const FormulaArray = exprFormula.split(/(?=\}[+-/*])/);

        const elementswrapped = FormulaArray.map((f) => {
            if (f) {
                let wrappedF = f;
                if (wrappedF.substring(wrappedF.length - 1) !== '}') {
                    wrappedF += '}';
                }
                if (wrappedF.charAt(0) === '}') {
                    if (wrappedF.length === 1) {
                        this.logit(`error in formula ${exprFormula}part ${f}`);
                        return '[]';
                    }
                    wrappedF = wrappedF.substring(1,wrappedF.length);
                    wrappedF = ` ${wrappedF.charAt(0)} [${wrappedF.substring(1, wrappedF.length)}]`;
                } else {
                    wrappedF = `[${wrappedF}]`;
                }
                return wrappedF;
            }
            this.logit(`error in formula ${exprFormula}part ${f}`);
            return '[]';
        }).join('');
        return elementswrapped;
    }
}

class AnalyticsRequester extends RequesterBase {
    constructor(logger) {
        super(logger);
    }
    get(dxSet, ouSet, periodSet) {
        const api = this.api;

        const periods = this.getRequestParameterFromSet(periodSet);
        const ids = this.getRequestParameterFromSet(dxSet);
        const ous = this.getRequestParameterFromSet(ouSet);

        if (ids.length === 0 || periods.length === 0) {
            this.logit(`tried to execute analytics call with ids: ${ids} and periods: ${periods} (one of these are empty)`);
            return Promise.reject('Error calling Analytics api');
        }
        const request = this.getRequest(ids, ous, periods);

        return api.get(request)
      .then(result => result)
      .catch((error) => {
          this.logit(JSON.stringify(error));
          return Promise.reject(error);
      });
    }

    getRequest(ids, ous, periods) {
        let request = `analytics?dimension=dx:${ids}&dimension=pe:${periods}&skipMeta=true`;
        if (ous.length > 0) {
            request += `&filter=ou:${ous}`;
        }
        return request;
    }

    getRequestParameterFromSet(setData) {
        let reqParam = '';
        if (setData) {
            for (const value of setData.values()) {
                reqParam += `${value};`;
            }
            reqParam = reqParam.trim();

            if (reqParam.length > 0) {
                reqParam = reqParam.substring(0, reqParam.length - 1);
            }
        }
        return reqParam;
    }
}

export default function addExtensions(d2, logger) {
    d2.formula = new FormulaRequester(logger);
    d2.analytics = new AnalyticsRequester(logger);
}

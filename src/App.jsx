import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppRouter from './router/route.jsx';
import React, { useEffect } from 'react';
import store, { persistor } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import moment from 'moment';

import 'moment/locale/fr';

import i18n from './locales/index.jsx'
import { I18nextProvider, useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  const lang = localStorage.getItem("I18N_LANGUAGE") || "fr_FR";


      moment.locale('fr', {
        months : t('momentMonthsLong').split('_'),
        monthsShort : t('momentMonthsShort').split('_'),
        monthsParseExact : true,
        weekdays : t('momentWeekDaysMomentLong').split('_'),
        weekdaysShort : t('momentWeekDaysMomentShort').split('_'),
        weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
        weekdaysParseExact : true,
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Aujourd’hui à] LT',
            nextDay : '[Demain à] LT',
            nextWeek : 'dddd [à] LT',
            lastDay : '[Hier à] LT',
            lastWeek : 'dddd [dernier à] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'dans %s',
            past : 'il y a %s',
            s : 'quelques secondes',
            m : 'une minute',
            mm : '%d minutes',
            h : 'une heure',
            hh : '%d heures',
            d : 'un jour',
            dd : '%d jours',
            M : 'un mois',
            MM : '%d mois',
            y : 'un an',
            yy : '%d ans'
        },
        dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
        ordinal : function (number) {
            return number + (number === 1 ? 'er' : 'e');
        },
        meridiemParse : /PD|MD/,
        isPM : function (input) {
            return input.charAt(0) === 'M';
        },
        // In case the meridiem units are not separated around 12, then implement
        // this function (look at locale/id.js for an example).
        // meridiemHour : function (hour, meridiem) {
        //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
        // },
        meridiem : function (hours, minutes, isLower) {
            return hours < 12 ? 'PD' : 'MD';
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // Used to determine first week of the year.
        }
    });


  localStorage.setItem("I18N_LANGUAGE", "fr_FR");


  return (
    <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

      <I18nextProvider i18n={i18n}>
      <Router>
        <AppRouter />
      </Router>
      </I18nextProvider>
      
      </PersistGate>
    </Provider>
    </>
  )
}

export default App

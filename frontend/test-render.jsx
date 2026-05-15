import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import UniversitiesPage from './src/pages/student/UniversitiesPage.jsx';

try {
  const html = renderToString(
    <StaticRouter location="/universities">
      <UniversitiesPage />
    </StaticRouter>
  );
  console.log("SUCCESS");
} catch (e) {
  console.error("ERROR:", e);
}

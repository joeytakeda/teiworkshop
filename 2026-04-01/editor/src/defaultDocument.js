/**
 * defaultDocument.js
 * The starter TEI document loaded into the editor on first run / reset.
 * Students will encode names, places, dates, and editorial notes
 * in this sample letter attributed to Jane Austen.
 */

export const DEFAULT_TEI = `<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>Document Title</title>
      </titleStmt>
      <publicationStmt>
        <p>TEI Workshop Exercise, 2025</p>
      </publicationStmt>
      <sourceDesc>
        <p>Sample for encoding practice.</p>
      </sourceDesc>
    </fileDesc>
  </teiHeader>
  <text>
    <body>
      <div>
        <head>Having a Coke With You</head>
        <lg>
          <l>is even more fun than going to <placeName>San Sebastian</placeName>, <placeName>Irún</placeName>, Hendaye, Biarritz,</l>
          <l>or being sick to my stomach on the <placeName>Travesera de Gracia</placeName> in Barcelona</l>
          <l>partly because in your orange shirt you look like a better happier <persName>St. Sebastian</persName></l>
          <l>partly because of my love for you, partly because of your love for yoghurt</l>
        </lg>
      </div>
    </body>
  </text>
</TEI>`;

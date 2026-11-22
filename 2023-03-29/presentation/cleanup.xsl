<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:math="http://www.w3.org/2005/xpath-functions/math"
    xmlns:xd="http://www.oxygenxml.com/ns/doc/xsl"
    exclude-result-prefixes="#all"
    xpath-default-namespace="http://www.tei-c.org/ns/1.0"
    xmlns=""
    version="3.0">
    <xd:doc scope="stylesheet">
        <xd:desc>
            <xd:p><xd:b>Created on:</xd:b> Mar 28, 2023</xd:p>
            <xd:p><xd:b>Author:</xd:b> takeda</xd:p>
            <xd:p></xd:p>
        </xd:desc>
    </xd:doc>
    
    <xsl:variable name="docs" select="collection('src?select=*.xml')"/>
    
    <xsl:mode name="p1" on-no-match="shallow-copy"/>
    <xsl:mode name="p2" on-no-match="shallow-copy"/>
    
    
    <xsl:output method="xml" indent="no"/>
    
    <xsl:template name="go">
        <xsl:for-each select="$docs">
            <xsl:variable name="id" select="(tokenize(document-uri(.),'/')[last()] => tokenize('_'))[1]" as="xs:string"/>
            <xsl:variable name="p1">
                <xsl:apply-templates select="." mode="p1"/>
            </xsl:variable>
            <xsl:variable name="p2">
                <xsl:apply-templates select="$p1" mode="p2"/>
            </xsl:variable>
            <xsl:result-document href="dist/{$id}.xml">
                <xsl:message select="current-output-uri()"/>
                <xsl:sequence select="$p2"/>
            </xsl:result-document>
        </xsl:for-each>
    </xsl:template>
    
    
    <xsl:template match="stage/@xml:id | l/@xml:id | p/@xml:id | sp/@xml:id | speaker/@xml:id" mode="p1"/>
    
    <xsl:template match="teiHeader" mode="p1">
        <xsl:comment>
            * Source file from Folger Shakespeare Library; modified for
            use in SFU Library's "Introduction to XPath" workshop under
            CC BY-NC 3.0: http://creativecommons.org/licenses/by-nc/3.0/deed.en_US
        </xsl:comment>
    </xsl:template>
    
    <xsl:template match="*[w]/text()" mode="p1"/>
    
    <xsl:template match="stage/@ana" mode="p1"/>
    
    <xsl:template match="*" priority="-1" mode="p2">
        <xsl:element name="{local-name()}">
            <xsl:sequence select="@*"/>
            <xsl:apply-templates mode="#current"/>
        </xsl:element>
        
    </xsl:template>
    
    <xsl:template match="processing-instruction()" mode="p2"/>
    
    <xsl:template match="TEI | text" mode="p2">
        <xsl:apply-templates mode="#current"/>
    </xsl:template>
    
    <xsl:template match="front | back" mode="p2"/>
    
    <xsl:template match="w" mode="p2">
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="lb" mode="p2">
        <xsl:sequence select="(codepoints-to-string(10), ((1 to 8) ! codepoints-to-string(32)))"/><xsl:next-match/>
    </xsl:template>
    
    <xsl:template match="pc" mode="p2">
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="c" mode="p2">
        <xsl:apply-templates/>
    </xsl:template>
    
    
    
</xsl:stylesheet>
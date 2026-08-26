param(
    [string]$InputPath = (Join-Path $PSScriptRoot "..\YEU_CAU_CHUC_NANG_DAY_DU.md"),
    [string]$OutputPath = (Join-Path $PSScriptRoot "..\YEU_CAU_CHUC_NANG_DAY_DU.docx")
)

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Escape-Xml([string]$Value) {
    if ($null -eq $Value) { return "" }
    return [System.Security.SecurityElement]::Escape($Value)
}

function New-Run([string]$Text, [bool]$Bold = $false, [int]$Size = 22) {
    $boldXml = if ($Bold) { "<w:b/>" } else { "" }
    return "<w:r><w:rPr>$boldXml<w:rFonts w:ascii=`"Times New Roman`" w:hAnsi=`"Times New Roman`"/><w:sz w:val=`"$Size`"/><w:szCs w:val=`"$Size`"/></w:rPr><w:t xml:space=`"preserve`">$(Escape-Xml $Text)</w:t></w:r>"
}

function New-Paragraph([string]$Text, [string]$Align = "left", [bool]$Bold = $false, [int]$Size = 24, [int]$Before = 0, [int]$After = 100) {
    $run = New-Run $Text $Bold $Size
    return "<w:p><w:pPr><w:jc w:val=`"$Align`"/><w:spacing w:before=`"$Before`" w:after=`"$After`" w:line=`"276`" w:lineRule=`"auto`"/></w:pPr>$run</w:p>"
}

function New-Cell([string]$Text, [int]$Width, [bool]$Header = $false, [string]$Align = "left") {
    $shade = if ($Header) { "<w:shd w:val=`"clear`" w:color=`"auto`" w:fill=`"D9EAF7`"/>" } else { "" }
    $bold = if ($Header) { "<w:b/>" } else { "" }
    $size = 24
    $escaped = Escape-Xml $Text
    return @"
<w:tc>
  <w:tcPr><w:tcW w:w="$Width" w:type="dxa"/><w:vAlign w:val="center"/>$shade<w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar></w:tcPr>
  <w:p><w:pPr><w:jc w:val="$Align"/><w:spacing w:after="0" w:line="360" w:lineRule="auto"/></w:pPr><w:r><w:rPr>$bold<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="$size"/><w:szCs w:val="$size"/></w:rPr><w:t xml:space="preserve">$escaped</w:t></w:r></w:p>
</w:tc>
"@
}

function New-Table([System.Collections.Generic.List[object]]$Rows) {
    $builder = [System.Text.StringBuilder]::new()
    [void]$builder.Append(@"
<w:tbl>
  <w:tblPr>
    <w:tblW w:w="9026" w:type="dxa"/>
    <w:tblLayout w:type="fixed"/>
    <w:tblBorders>
      <w:top w:val="single" w:sz="8" w:color="000000"/>
      <w:left w:val="single" w:sz="8" w:color="000000"/>
      <w:bottom w:val="single" w:sz="8" w:color="000000"/>
      <w:right w:val="single" w:sz="8" w:color="000000"/>
      <w:insideH w:val="single" w:sz="6" w:color="000000"/>
      <w:insideV w:val="single" w:sz="6" w:color="000000"/>
    </w:tblBorders>
  </w:tblPr>
  <w:tblGrid><w:gridCol w:w="1100"/><w:gridCol w:w="1600"/><w:gridCol w:w="6326"/></w:tblGrid>
"@)
    [void]$builder.Append("<w:tr><w:trPr><w:tblHeader/></w:trPr>")
    [void]$builder.Append((New-Cell "ID" 1100 $true "center"))
    [void]$builder.Append((New-Cell "Chức năng" 1600 $true "center"))
    [void]$builder.Append((New-Cell "Mô tả" 6326 $true "center"))
    [void]$builder.Append("</w:tr>")

    foreach ($row in $Rows) {
        [void]$builder.Append("<w:tr>")
        [void]$builder.Append((New-Cell $row.Id 1100 $false "center"))
        [void]$builder.Append((New-Cell $row.Name 1600 $false "left"))
        [void]$builder.Append((New-Cell $row.Description 6326 $false "both"))
        [void]$builder.Append("</w:tr>")
    }
    [void]$builder.Append("</w:tbl><w:p><w:pPr><w:spacing w:after=`"80`"/></w:pPr></w:p>")
    return $builder.ToString()
}

function Add-ZipText([System.IO.Compression.ZipArchive]$Archive, [string]$EntryName, [string]$Content) {
    $entry = $Archive.CreateEntry($EntryName, [System.IO.Compression.CompressionLevel]::Optimal)
    $stream = $entry.Open()
    $writer = [System.IO.StreamWriter]::new($stream, [System.Text.UTF8Encoding]::new($false))
    try { $writer.Write($Content) } finally { $writer.Dispose(); $stream.Dispose() }
}

$lines = Get-Content -LiteralPath $InputPath -Encoding UTF8
$body = [System.Text.StringBuilder]::new()
$tableRows = [System.Collections.Generic.List[object]]::new()

function Flush-Table {
    if ($tableRows.Count -gt 0) {
        [void]$body.Append((New-Table $tableRows))
        $tableRows.Clear()
    }
}

foreach ($line in $lines) {
    if ($line -match '^\|\s*(FR-\d+)\s*\|\s*([^|]+?)\s*\|\s*(.*?)\s*\|$') {
        $tableRows.Add([PSCustomObject]@{ Id = $Matches[1]; Name = $Matches[2].Trim(); Description = $Matches[3].Trim() })
        continue
    }
    if ($line -match '^\|\s*ID\s*\|' -or $line -match '^\|[-| ]+\|$' -or [string]::IsNullOrWhiteSpace($line)) { continue }

    Flush-Table
    if ($line -match '^#\s+(.+)$') {
        [void]$body.Append((New-Paragraph $Matches[1] "center" $true 32 0 240))
    } elseif ($line -match '^##\s+(.+)$') {
        [void]$body.Append((New-Paragraph $Matches[1] "left" $true 26 180 120))
    } elseif ($line -match '^[-*]\s+(.+)$') {
        [void]$body.Append((New-Paragraph ("• " + $Matches[1]) "both" $false 22 0 60))
    } else {
        [void]$body.Append((New-Paragraph $line "both" $false 22 0 80))
    }
}
Flush-Table

$documentXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    $($body.ToString())
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
      <w:cols w:space="708"/>
      <w:docGrid w:linePitch="360"/>
    </w:sectPr>
  </w:body>
</w:document>
"@

$contentTypes = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>
"@

$relationships = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
"@

$absoluteOutput = [System.IO.Path]::GetFullPath($OutputPath)
if (Test-Path -LiteralPath $absoluteOutput) { Remove-Item -LiteralPath $absoluteOutput -Force }
$fileStream = [System.IO.File]::Open($absoluteOutput, [System.IO.FileMode]::CreateNew)
$archive = [System.IO.Compression.ZipArchive]::new($fileStream, [System.IO.Compression.ZipArchiveMode]::Create, $false)
try {
    Add-ZipText $archive "[Content_Types].xml" $contentTypes
    Add-ZipText $archive "_rels/.rels" $relationships
    Add-ZipText $archive "word/document.xml" $documentXml
} finally {
    $archive.Dispose()
    $fileStream.Dispose()
}

Write-Output $absoluteOutput

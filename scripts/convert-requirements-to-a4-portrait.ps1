param(
    [string]$InputPath = (Join-Path $PSScriptRoot "..\YEU_CAU_CHUC_NANG_DAY_DU.docx"),
    [string]$OutputPath = (Join-Path $PSScriptRoot "..\YEU_CAU_CHUC_NANG_DAY_DU_A4_DOC.docx"),
    [switch]$PlainHeader
)

Add-Type -AssemblyName System.IO.Compression

$inputAbsolute = [System.IO.Path]::GetFullPath($InputPath)
$outputAbsolute = [System.IO.Path]::GetFullPath($OutputPath)
$inputStream = [System.IO.File]::Open(
    $inputAbsolute,
    [System.IO.FileMode]::Open,
    [System.IO.FileAccess]::Read,
    [System.IO.FileShare]::ReadWrite -bor [System.IO.FileShare]::Delete
)
$inputArchive = [System.IO.Compression.ZipArchive]::new(
    $inputStream,
    [System.IO.Compression.ZipArchiveMode]::Read,
    $false
)

$entries = @{}
try {
    foreach ($entry in $inputArchive.Entries) {
        $entryStream = $entry.Open()
        $memory = [System.IO.MemoryStream]::new()
        try {
            $entryStream.CopyTo($memory)
            $entries[$entry.FullName] = $memory.ToArray()
        } finally {
            $memory.Dispose()
            $entryStream.Dispose()
        }
    }
} finally {
    $inputArchive.Dispose()
    $inputStream.Dispose()
}

$documentText = [System.Text.Encoding]::UTF8.GetString($entries['word/document.xml'])
[xml]$document = $documentText
$wordNamespace = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
$namespaceManager = [System.Xml.XmlNamespaceManager]::new($document.NameTable)
$namespaceManager.AddNamespace('w', $wordNamespace)

$pageSize = $document.SelectSingleNode('//w:sectPr/w:pgSz', $namespaceManager)
$null = $pageSize.SetAttribute('w', $wordNamespace, '11906')
$null = $pageSize.SetAttribute('h', $wordNamespace, '16838')
$pageSize.RemoveAttribute('orient', $wordNamespace)

$pageMargin = $document.SelectSingleNode('//w:sectPr/w:pgMar', $namespaceManager)
foreach ($name in @('top', 'right', 'bottom', 'left')) {
    $null = $pageMargin.SetAttribute($name, $wordNamespace, '1440')
}
$null = $pageMargin.SetAttribute('header', $wordNamespace, '720')
$null = $pageMargin.SetAttribute('footer', $wordNamespace, '720')

$columnWidths = @(1100, 1600, 6326)
foreach ($table in $document.SelectNodes('//w:tbl', $namespaceManager)) {
    $tableWidth = $table.SelectSingleNode('./w:tblPr/w:tblW', $namespaceManager)
    $null = $tableWidth.SetAttribute('w', $wordNamespace, '9026')

    $gridColumns = $table.SelectNodes('./w:tblGrid/w:gridCol', $namespaceManager)
    for ($index = 0; $index -lt [Math]::Min($gridColumns.Count, 3); $index++) {
        $null = $gridColumns[$index].SetAttribute('w', $wordNamespace, [string]$columnWidths[$index])
    }

    foreach ($row in $table.SelectNodes('./w:tr', $namespaceManager)) {
        $cells = $row.SelectNodes('./w:tc', $namespaceManager)
        for ($index = 0; $index -lt [Math]::Min($cells.Count, 3); $index++) {
            $cellWidth = $cells[$index].SelectSingleNode('./w:tcPr/w:tcW', $namespaceManager)
            $null = $cellWidth.SetAttribute('w', $wordNamespace, [string]$columnWidths[$index])
        }
    }

    foreach ($spacing in $table.SelectNodes('.//w:pPr/w:spacing', $namespaceManager)) {
        $null = $spacing.SetAttribute('line', $wordNamespace, '360')
        $null = $spacing.SetAttribute('lineRule', $wordNamespace, 'auto')
        $null = $spacing.SetAttribute('after', $wordNamespace, '0')
    }
    foreach ($sizeNode in $table.SelectNodes('.//w:rPr/w:sz | .//w:rPr/w:szCs', $namespaceManager)) {
        $null = $sizeNode.SetAttribute('val', $wordNamespace, '24')
    }

    if ($PlainHeader) {
        foreach ($headerMarker in $table.SelectNodes('./w:tr[1]/w:trPr/w:tblHeader', $namespaceManager)) {
            $null = $headerMarker.ParentNode.RemoveChild($headerMarker)
        }
        foreach ($shading in $table.SelectNodes('./w:tr[1]/w:tc/w:tcPr/w:shd', $namespaceManager)) {
            $null = $shading.ParentNode.RemoveChild($shading)
        }
    }
}

$settings = [System.Xml.XmlWriterSettings]::new()
$settings.Encoding = [System.Text.UTF8Encoding]::new($false)
$settings.Indent = $false
$documentMemory = [System.IO.MemoryStream]::new()
$writer = [System.Xml.XmlWriter]::Create($documentMemory, $settings)
try {
    $document.Save($writer)
    $writer.Flush()
    $entries['word/document.xml'] = $documentMemory.ToArray()
} finally {
    $writer.Dispose()
    $documentMemory.Dispose()
}

$outputStream = [System.IO.File]::Open(
    $outputAbsolute,
    [System.IO.FileMode]::Create,
    [System.IO.FileAccess]::Write,
    [System.IO.FileShare]::None
)
$outputArchive = [System.IO.Compression.ZipArchive]::new(
    $outputStream,
    [System.IO.Compression.ZipArchiveMode]::Create,
    $false
)
try {
    foreach ($entryName in $entries.Keys) {
        $entry = $outputArchive.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
        $stream = $entry.Open()
        try {
            $bytes = $entries[$entryName]
            $stream.Write($bytes, 0, $bytes.Length)
        } finally {
            $stream.Dispose()
        }
    }
} finally {
    $outputArchive.Dispose()
    $outputStream.Dispose()
}

Write-Output $outputAbsolute

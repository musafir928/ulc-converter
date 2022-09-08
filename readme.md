# What is this?

A tool for converting between arabic based, latin based and cyrillic based Uyghur characters.
ئۇيغۇر يېزىقلىرىنى ئۆز - ئارا ئالماشتۇرۇش قورالى

# Installation

`npm install ulc-converter`

# Example

```
import ulcConverter from 'ulc-converter'

ulcConverter("senet, sen'et", 'lu') // سەنەت، سەنئەت

```

# Explanation

```
ulcConverter(arg1, arg2)

arg1: {
    description: 'source text, can be in arabic based Uyghur format or latin based Uyghur format or cyrillic based Uyghur format'.
    required: true
    }
arg2: {
    description: 'the direction of the converting, can be ul/lu(Uyghur to latin/latin to Uyghur) or uc,cu(Uyghur to cyrillic/cyrillic to Uyghur),
    required: false,
    defaultValue: 'lu' // latin to Uyghur
}

```

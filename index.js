const custom_elipbe = require('./yeziq.json');

function ulcConvert(origin_text, direction = 'lu') {
    let direction_list = direction.split('');
    let result = origin_text.toLowerCase();
    if (direction_list[0] != 'u') {
        result = fix_vowel(
            result,
            custom_elipbe[direction_list[0]].vowel,
            Object.values(custom_elipbe[direction_list[0]].asas)
        );
        result = translate_from_or_to_uyghur(result, custom_elipbe[direction_list[0]], false);
    }

    if (direction_list[1] != 'u') {
        result = translate_from_or_to_uyghur(result, custom_elipbe[direction_list[1]], true);
        result = replaceAll(result, 'ئ');
        result = replaceAll(result, 'ъ');
    } else {
        result = replaceAll(result, 'ъ');
        result = replaceAll(result, " '", ' ъ');
        result = replaceAll(result, "' ", 'ъ ');
        result = replaceAll(result, " ' ", ' ъ ');
        result = replaceAll(result, "'");
        result = replaceAll(result, ' ъ', " '");
        result = replaceAll(result, 'ъ ', "' ");
        result = replaceAll(result, ' ъ ', " ' ");
    }

    return result;
}

function translate_from_or_to_uyghur(origin_text, elipbe, from_uyghur) {
    let result = from_uyghur ? origin_text : origin_text.toLowerCase();
    result = replacement_main_loop(origin_text, elipbe, from_uyghur);
    if (result[0] == "'" || result[0] == 'ъ') {
        result = result.substring(1);
    }
    if (from_uyghur) {
        result = handle_upper_case(result, Object.values(elipbe.asas));
    }
    return result;
}

function swapKeysAndValues(obj) {
    const swapped = Object.entries(obj).map(([key, value]) => [value, key]);

    return Object.fromEntries(swapped);
}

function replacement_main_loop(origin_text, elipbe, from_uyghur) {
    let result = origin_text;
    let special_before = from_uyghur
        ? elipbe.special_right.special_before
        : elipbe.special_left.special_before;
    let special_after = from_uyghur
        ? elipbe.special_right.special_after
        : elipbe.special_left.special_after;
    let asas = from_uyghur ? elipbe.asas : swapKeysAndValues(elipbe.asas);

    if (special_before && Object.keys(special_before).length) {
        for (let el in special_before) {
            result = replacement_loop(result, special_before[el]);
        }
    }
    result = replacement_loop(result, asas);

    if (special_after && Object.keys(special_after).length) {
        for (let el in special_after) {
            result = replacement_loop(result, special_after[el]);
        }
    }

    return result;
}

function replaceAll(result, reg, value = '') {
    const regex = new RegExp(reg, 'gi');
    return result.replace(regex, value);
}
function replacement_loop(or_str, source) {
    let result = or_str;

    for (let k in source) {
        result = replaceAll(result, k, source[k]);
    }
    return result;
}

function fix_vowel(origin_text, vowels, all_char) {
    let or_str = ' ' + origin_text.toLowerCase();
    let j = 1;
    while (j < or_str.length) {
        if (
            vowels.includes(or_str[j]) &&
            or_str[j] != ' ' &&
            (vowels.includes(or_str[j - 1]) || !all_char.includes(or_str[j - 1]))
        ) {
            let tem = or_str;
            or_str = tem.substring(0, j) + 'ئ' + tem.substring(j);
            j++;
        }
        j++;
    }

    return or_str.substring(1);
}

function handle_upper_case(result, source) {
    let or_str = result;
    const special = ['.', '?', '!', ';'];
    let k = 0;
    for (let i = 0; i < or_str.length - 1; i++) {
        if (k > i) {
            continue;
        }
        if (special.includes(or_str[i])) {
            k = i + 1;
            while (!source.includes(or_str[k])) {
                if (k == or_str.length - 1) {
                    break;
                }
                k++;
            }
            or_str = or_str.substring(0, k) + or_str[k].toUpperCase() + or_str.substring(k + 1);
        }
    }
    or_str = or_str[0].toUpperCase() + or_str.substring(1);
    return or_str;
}

module.exports = ulcConvert;

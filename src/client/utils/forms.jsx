import {availableLanguages, disableUsed} from './languages';
import React from 'react';

export const TextLanguageFieldset = ({title, items = [], size = {cols: 40, rows: 1},
                                         prefix,
                                         handle = (data) => console.log(data),
                                         add = () => console.log('+'),
                                         remove = (index) => console.log('-', index)}) => {

    const languages = availableLanguages();
    disableUsed(languages, items.map(name => name.lang));

    return (
        <fieldset>
            <label htmlFor="name" style={{display: "block"}}
            >{title}</label>

            {items.map((item, index) => (
                <div className="text-language" key={index}>
                    { prefix && <textarea readOnly
                        cols={prefix.cols} rows={prefix.rows}
                        value={prefix.text}
                        style={{color: 'gray', resize: 'none'}}
                    />}
                    <textarea cols={size.cols} rows={size.rows}
                           value={item.temp || item.text}
                           onChange={(e) => handle(
                               item.temp
                                   ? item.temp = e.target.value
                                   : item.text = e.target.value
                           )}/>

                    <LanguageSelect languages={languages}
                                    selected={item.lang}
                                    onChange={(e) => handle(item.lang = e.target.value)}/>

                    {index === items.length-1 && index < languages.length-1 &&
                    <button style={{margin: '0 20px 0 20px'}}
                            onClick={() => add()}
                    >+</button>}

                    {index > 0 &&
                    <button style={{margin: '0 20px 0 20px'}}
                            onClick={() => {remove(index);}}
                    >-</button>}

                </div>))
            }
            {items.length === 0 &&
            <button style={{margin: '0 20px 0 20px'}}
                    onClick={() => add()}
            >+</button>}
        </fieldset>
    );
};

export const LanguageSelect = ({languages = availableLanguages(),
                                   selected = false,
                                   onChange = (e) => console.log(e.target.value)}) => {

    return (
        <select name='language'
                value={selected || languages.find(lang => lang.default)}
                onChange={(e) => onChange(e)}>
            {languages.map((lang, i) => (
                <option key={i} value={lang.abbr} disabled={lang.disabled}>{lang.full}</option>
            ))}
        </select>
    );
};
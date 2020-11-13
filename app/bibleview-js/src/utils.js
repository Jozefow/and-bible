/*
 * Copyright (c) 2020 Martin Denham, Tuomas Airaksinen and the And Bible contributors.
 *
 * This file is part of And Bible (http://github.com/AndBible/and-bible).
 *
 * And Bible is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * And Bible is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with And Bible.
 * If not, see http://www.gnu.org/licenses/.
 */

import {inject, onMounted, ref} from "@vue/runtime-core";
import {sprintf} from "sprintf-js";

export function getVerseInfo(osisID) {
    if(!osisID) return null;
    const [book, chapter, verse] = osisID.split(".")
    return {osisID: osisID, book, chapter: parseInt(chapter), verse: parseInt(verse)}
}

export function useCommon(props) {
    const config = inject("config");
    const strings = inject("strings");
    const verseInfo = inject("verseInfo", getVerseInfo(props.osisID));
    const elementCount = inject("elementCount");
    const contentTag = ref(null);
    const thisCount = ref(-1);
    onMounted(() => {
        thisCount.value = elementCount.value;
        elementCount.value ++;
        if(contentTag.value) {
            contentTag.value.dataset.elementCount = thisCount.value.toString();
            contentTag.value.dataset.osisID = verseInfo ? JSON.stringify(verseInfo.osisID) : null;
        }
    });

    function split(string, separator, n) {
        return string.split(separator)[n]
    }

    return {config, strings, contentTag, elementCount, sprintf, split}
}
<!--
  - Copyright (c) 2021-2022 Martin Denham, Tuomas Airaksinen and the AndBible contributors.
  -
  - This file is part of AndBible: Bible Study (http://github.com/AndBible/and-bible).
  -
  - AndBible is free software: you can redistribute it and/or modify it under the
  - terms of the GNU General Public License as published by the Free Software Foundation,
  - either version 3 of the License, or (at your option) any later version.
  -
  - AndBible is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
  - without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  - See the GNU General Public License for more details.
  -
  - You should have received a copy of the GNU General Public License along with AndBible.
  - If not, see http://www.gnu.org/licenses/.
  -->

<template>
  <div :id="`doc-${document.id}`"
       class="bible-document"
       :data-book-initials="bookInitials"
  >
    <Chapter v-if="document.addChapter" :n="document.chapterNumber.toString()"/>
    <OsisFragment :fragment="document.osisFragment"/>
  </div>
</template>

<script setup lang="ts">
import {inject, provide, ref} from "vue";
import {useBookmarks} from "@/composables/bookmarks";
import OsisFragment from "@/components/documents/OsisFragment.vue";
import {useCommon} from "@/composables";
import Chapter from "@/components/OSIS/Chapter.vue";
import {bibleDocumentInfoKey, footnoteCountKey, globalBookmarksKey} from "@/types/constants";
import {BibleDocumentType} from "@/types/documents";

const props = defineProps<{ document: BibleDocumentType }>();

// eslint-disable-next-line no-unused-vars,vue/no-setup-props-destructure
const {id, bibleBookName, bookInitials, bookmarks, ordinalRange, originalOrdinalRange, v11n} = props.document;

provide(bibleDocumentInfoKey, {bibleBookName, bookInitials, ordinalRange, originalOrdinalRange, v11n})

const globalBookmarks = inject(globalBookmarksKey)!;
globalBookmarks.updateBookmarks(bookmarks);

const {config, appSettings, ...common} = useCommon();

useBookmarks(id, ordinalRange, globalBookmarks, bookInitials, ref(true), common, config, appSettings);

let footNoteCount = ordinalRange[0] || 0;

function getFootNoteCount() {
    return footNoteCount++;
}

provide(footnoteCountKey, {getFootNoteCount});
</script>

<style scoped>

</style>

<!--
  - Copyright (c) 2020-2022 Martin Denham, Tuomas Airaksinen and the AndBible contributors.
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
  <AmbiguousSelection do-not-close-modals ref="ambiguousSelection"/>
  <ModalDialog @close="showNote = false" v-if="showNote" :locate-top="locateTop">
    <div class="scrollable" @click="ambiguousSelection?.handle">
      <slot/>
      <OpenAllLink :v11n="v11n"/>
    </div>
    <template #title>
      <template v-if="isCrossReference">
        {{ strings.crossReferenceText }}
      </template>
      <template v-else>
        {{ noteType }}
      </template>
    </template>
  </ModalDialog>
  <span
    v-if="showHandle"
    class="skip-offset">
    <span class="highlight-transition" :class="{isHighlighted: showNote, noteHandle: true, isFootNote, isCrossReference, isOther}" @click="noteClicked">
      {{handle}}
    </span>
  </span>
</template>

<script setup lang="ts">
import {checkUnsupportedProps, useCommon, useReferenceCollector} from "@/composables";
import ModalDialog from "@/components/modals/ModalDialog.vue";
import {get} from "lodash";
import {computed, inject, provide, ref} from "vue";
import {addEventFunction, EventPriorities, isBottomHalfClicked} from "@/utils";
import OpenAllLink from "@/components/OpenAllLink.vue";
import {exportModeKey, footnoteCountKey, osisFragmentKey, referenceCollectorKey} from "@/types/constants";
import AmbiguousSelection from "@/components/modals/AmbiguousSelection.vue";

const alphabets = "abcdefghijklmnopqrstuvwxyz"

const props = defineProps<{
    osisID?: string
    osisRef?: string
    placement?: string
    type?: string
    subType?: string
    n?: string
    resp?: string
}>();

const ambiguousSelection = ref<InstanceType<typeof AmbiguousSelection> | null>(null);
checkUnsupportedProps(props, "resp");
checkUnsupportedProps(props, "placement", ['foot']);
checkUnsupportedProps(props, "type",
    ["explanation", "translation", "crossReference", "variant", "alternative", "study", "x-editor-correction"]);
checkUnsupportedProps(props, "subType",
    ["x-gender-neutral", 'x-original', 'x-variant-adds', 'x-bondservant']);
const {strings, config, sprintf} = useCommon();
const showNote = ref(false);
const locateTop = ref(false);
const {getFootNoteCount} = inject(footnoteCountKey)!;

function runningHandle() {
    return alphabets[getFootNoteCount() % alphabets.length];
}

const handle = computed(() => props.n || runningHandle());
const isFootNote = computed(() => ["explanation", "translation", "study", "variant", "alternative", "x-editor-correction"].includes(props.type!));
const typeStr = computed(() => get(typeStrings, props.type!));
const noteType = computed(() => typeStr.value ? sprintf(strings.noteText, typeStr.value) : strings.noteTextWithoutType);
const isCrossReference = computed(() => props.type === "crossReference");
const isOther = computed(() => !isCrossReference.value && !isFootNote.value);

function noteClicked(event: MouseEvent) {
    addEventFunction(event,
        () => {
            if (!showNote.value) {
                referenceCollector.clear();
                locateTop.value = isBottomHalfClicked(event);
                showNote.value = true;
            }
        },
        {title: strings.openFootnote, priority: EventPriorities.FOOTNOTE});
}

const typeStrings = {
    explanation: strings.footnoteTypeExplanation,
    translation: strings.footnoteTypeTranslation,
    study: strings.footnoteTypeStudy,
    variant: strings.footnoteTypeVariant,
    alternative: strings.footnoteTypeAlternative,
};
const {v11n} = inject(osisFragmentKey)!
const referenceCollector = useReferenceCollector();
provide(referenceCollectorKey, referenceCollector);

const exportMode = inject(exportModeKey, ref(false));

const showHandle = computed(
    () => !exportMode.value && ((config.showFootNotes && isCrossReference.value) || config.showFootNotes)
);
</script>

<style scoped lang="scss">
@import "~@/common.scss";

.note-handle-base {
  @extend .superscript;
  padding: 0.2em;
}

.isCrossReference {
  @extend .note-handle-base;
  color: orange;
}

.open-all {
  padding-top: 1em;
}

.isFootNote {
  @extend .note-handle-base;
  color: #b63afd;
}

.isOther {
  @extend .note-handle-base;
  color: #209546;
}

.scrollable {
  @extend .visible-scrollbar;
  overflow-y: auto;
  max-height: calc(var(--max-height) - 25pt);
}
</style>

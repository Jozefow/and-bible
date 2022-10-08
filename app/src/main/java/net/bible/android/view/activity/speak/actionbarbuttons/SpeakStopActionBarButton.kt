/*
 * Copyright (c) 2020-2022 Martin Denham, Tuomas Airaksinen and the AndBible contributors.
 *
 * This file is part of AndBible: Bible Study (http://github.com/AndBible/and-bible).
 *
 * AndBible is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * AndBible is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with AndBible.
 * If not, see http://www.gnu.org/licenses/.
 */
package net.bible.android.view.activity.speak.actionbarbuttons

import android.view.MenuItem
import net.bible.service.common.CommonUtils.getResourceString
import net.bible.android.control.ApplicationScope
import net.bible.android.activity.R
import javax.inject.Inject

/**
 * Stop Speaking
 *
 * @author Martin Denham [mjdenham at gmail dot com]
 */
@ApplicationScope
open class SpeakStopActionBarButton @Inject constructor() : SpeakActionBarButtonBase()
{
    override fun onMenuItemClick(menuItem: MenuItem): Boolean {
        speakControl.stop(false, false)
        return true
    }

    override val title: String get() = getResourceString(R.string.stop)
    override val icon: Int get() = R.drawable.ic_media_stop

    override val canShow get() = isSpeakMode
}

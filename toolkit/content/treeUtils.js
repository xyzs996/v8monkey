# -*- Mode: Java; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*-
# ***** BEGIN LICENSE BLOCK *****
# Version: MPL 1.1/GPL 2.0/LGPL 2.1
#
# The contents of this file are subject to the Mozilla Public License Version
# 1.1 (the "License"); you may not use this file except in compliance with
# the License. You may obtain a copy of the License at
# http://www.mozilla.org/MPL/
#
# Software distributed under the License is distributed on an "AS IS" basis,
# WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
# for the specific language governing rights and limitations under the
# License.
#
# The Original Code is the Firefox Preferences System.
#
# The Initial Developer of the Original Code is
# Ben Goodger.
# Portions created by the Initial Developer are Copyright (C) 2005
# the Initial Developer. All Rights Reserved.
#
# Contributor(s):
#   Ben Goodger <ben@mozilla.org>
#   Felix Fung <felix.the.cheshire.cat@gmail.com>
#
# Alternatively, the contents of this file may be used under the terms of
# either the GNU General Public License Version 2 or later (the "GPL"), or
# the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
# in which case the provisions of the GPL or the LGPL are applicable instead
# of those above. If you wish to allow use of your version of this file only
# under the terms of either the GPL or the LGPL, and not to allow others to
# use your version of this file under the terms of the MPL, indicate your
# decision by deleting the provisions above and replace them with the notice
# and other provisions required by the GPL or the LGPL. If you do not delete
# the provisions above, a recipient may use your version of this file under
# the terms of any one of the MPL, the GPL or the LGPL.
#
# ***** END LICENSE BLOCK *****

var gTreeUtils = {
  deleteAll: function (aTree, aView, aItems, aDeletedItems)
  {
    for (var i = 0; i < aItems.length; ++i)
      aDeletedItems.push(aItems[i]);
    aItems.splice(0, aItems.length);
    var oldCount = aView.rowCount;
    aView._rowCount = 0;
    aTree.treeBoxObject.rowCountChanged(0, -oldCount);
  },

  deleteSelectedItems: function (aTree, aView, aItems, aDeletedItems)
  {
    var selection = aTree.view.selection;
    selection.selectEventsSuppressed = true;

    var rc = selection.getRangeCount();
    for (var i = 0; i < rc; ++i) {
      var min = { }; var max = { };
      selection.getRangeAt(i, min, max);
      for (var j = min.value; j <= max.value; ++j) {
        aDeletedItems.push(aItems[j]);
        aItems[j] = null;
      }
    }

    var nextSelection = 0;
    for (i = 0; i < aItems.length; ++i) {
      if (!aItems[i]) {
        var j = i;
        while (j < aItems.length && !aItems[j])
          ++j;
        aItems.splice(i, j - i);
        nextSelection = j < aView.rowCount ? j - 1 : j - 2;
        aView._rowCount -= j - i;
        aTree.treeBoxObject.rowCountChanged(i, i - j);
      }
    }

    if (aItems.length) {
      selection.select(nextSelection);
      aTree.treeBoxObject.ensureRowIsVisible(nextSelection);
      aTree.focus();
    }
    selection.selectEventsSuppressed = false;
  },

  sort: function (aTree, aView, aDataSet, aColumn, aComparator,
                  aLastSortColumn, aLastSortAscending)
  {
    var ascending = (aColumn == aLastSortColumn) ? !aLastSortAscending : true;
    if (aDataSet.length == 0)
      return ascending;

    var numericSort = !isNaN(aDataSet[0][aColumn]);
    var sortFunction = null;
    if (aComparator) {
      sortFunction = function (a, b) { return aComparator(a[aColumn], b[aColumn]); };
    }
    aDataSet.sort(sortFunction);
    if (!ascending)
      aDataSet.reverse();

    aTree.view.selection.select(-1);
    aTree.view.selection.select(0);
    aTree.treeBoxObject.invalidate();
    aTree.treeBoxObject.ensureRowIsVisible(0);

    return ascending;
  }
};


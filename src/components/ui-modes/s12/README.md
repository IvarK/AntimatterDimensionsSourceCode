# GUIDE TO THE CODE

Corresponding(-ish) components:
- S12Taskbar: The sidebar on modern
- TaskbarIcon: Main tab button
- S12Subtabs: Subtab button(s)

Due to how the backdrop-filter property works, S12Subtabs has to be in a separate container from the
taskbar, which has the unfortunate consequence of likely making the code messier.

Windows.js basically handles everything that needs to be used in between components.
- HoveringTab controls which set of subtabs should be shown at any time.
- TabButtonPositions keeps track of the positions of all "Tab Buttons" (i.e. Taskbar Icons) which are then
used to calculate the position (More specifically, the `left` attr) of the subtabs that show up on hover.
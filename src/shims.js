import Vue from "vue";
window.Vue = Vue;

import Decimal from "break_infinity.js";
window.Decimal = Decimal;

import CodeMirror from "codemirror/lib/codemirror";
import "codemirror/addon/mode/simple";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/lint/lint";
import "codemirror/addon/selection/active-line";
import "codemirror/addon/edit/closebrackets";
window.CodeMirror = CodeMirror;

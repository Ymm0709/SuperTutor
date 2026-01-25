// 静态题库数据
export const questionBank = [
  {
    id: "Q1",
    level: 1,
    type: "multiple_choice",
    prompt: {
      zh: "哪个语句将值 10 赋给变量 x？",
      en: "Which statement assigns the value 10 to the variable x?"
    },
    options: {
      zh: ["10 = x", "x == 10", "x ← 10", "x + 10"],
      en: ["10 = x", "x == 10", "x ← 10", "x + 10"]
    },
    answer: "x ← 10",
    misconception: "assignment_vs_comparison",
    hint: {
      zh: "赋值是将值放入变量。比较是检查是否相等。",
      en: "Assignment puts a value into a variable. Comparison checks equality."
    },
    code: "x ← 10"
  },
  {
    id: "Q2",
    level: 1,
    type: "true_false",
    prompt: {
      zh: "一个变量可以同时存储多个值。",
      en: "A variable can store more than one value at the same time."
    },
    answer: false,
    misconception: "variable_storage",
    hint: {
      zh: "把变量想象成一个只能装一个值的盒子。",
      en: "Think of a variable as a box that holds ONE value."
    }
  },
  {
    id: "Q3",
    level: 2,
    type: "multiple_choice",
    prompt: {
      zh: "执行下面的赋值语句后，x 的最终值是多少？",
      en: "After executing the following assignment statements, what is the final value of x?"
    },
    code: "x ← 3\nx ← 8",
    options: {
      zh: ["3", "8", "11", "x"],
      en: ["3", "8", "11", "x"]
    },
    answer: "8",
    misconception: "reassignment_confusion",
    hint: {
      zh: "新的赋值会替换旧的值。",
      en: "A new assignment replaces the old value."
    },
    visual: {
      before: { x: 3 },
      after: { x: 8 }
    }
  },
  {
    id: "Q4",
    level: 2,
    type: "short_answer",
    prompt: {
      zh: "执行下面的赋值语句后，score 的值是多少？",
      en: "After executing the following assignment statements, what is the value of score?"
    },
    code: "score ← 5\nscore ← score + 2",
    answer: "7",
    misconception: "self_reference_confusion",
    hint: {
      zh: "在更新变量之前使用变量的当前值。",
      en: "Use the current value of the variable before updating it."
    },
    visual: {
      before: { score: 5 },
      after: { score: 7 }
    }
  },
  {
    id: "Q5",
    level: 3,
    type: "multiple_choice",
    prompt: {
      zh: "执行下面的程序后，y 的值是多少？",
      en: "After executing the following program, what is the value of y?"
    },
    code: "x ← 4\ny ← x + 1\nx ← 10",
    options: {
      zh: ["5", "11", "10", "x + 1"],
      en: ["5", "11", "10", "x + 1"]
    },
    answer: "5",
    misconception: "thinking_variables_are_linked",
    hint: {
      zh: "当其他变量改变时，变量不会自动更新。",
      en: "Variables do not automatically update when other variables change."
    },
    visual: {
      before: { x: 4, y: undefined },
      after: { x: 10, y: 5 }
    }
  },
  {
    id: "Q6",
    level: 2,
    type: "short_answer",
    prompt: {
      zh: "执行下面的赋值语句后，total 的值是多少？",
      en: "After executing the following assignment statement, what is the value of total?"
    },
    code: "total ← 6 + 2",
    answer: "8",
    misconception: "expression_not_evaluated",
    hint: {
      zh: "在存储之前先计算表达式的值。",
      en: "Evaluate the expression before storing it."
    },
    visual: {
      before: { total: undefined },
      after: { total: 8 }
    }
  },
  {
    id: "Q7",
    level: 3,
    type: "short_answer",
    prompt: {
      zh: "执行下面的程序后，y 的值是多少？",
      en: "After executing the following program, what is the value of y?"
    },
    code: "x ← 5\ny ← x\nx ← 9",
    answer: "5",
    misconception: "copy_vs_reference",
    hint: {
      zh: "赋值是复制值，而不是建立连接。",
      en: "Assignment copies the value, not a connection."
    },
    visual: {
      before: { x: 5, y: undefined },
      after: { x: 9, y: 5 }
    }
  },
  {
    id: "Q8",
    level: 1,
    type: "multiple_choice",
    prompt: {
      zh: "哪一行显示了对变量的理解错误？",
      en: "Which line shows an error in understanding variables?"
    },
    code: "x ← 3\ny ← x + 2\nx == 5\ntotal ← total + 1",
    options: {
      zh: ["x ← 3", "y ← x + 2", "x == 5", "total ← total + 1"],
      en: ["x ← 3", "y ← x + 2", "x == 5", "total ← total + 1"]
    },
    answer: "x == 5",
    misconception: "comparison_as_assignment",
    hint: {
      zh: "== 不会存储值。",
      en: "== does not store a value."
    }
  },
  {
    id: "Q9",
    level: 2,
    type: "multiple_choice",
    prompt: {
      zh: "一个游戏使用变量 lives。lives ← 3。玩家失去一条生命。哪个语句能正确更新 lives？",
      en: "A game uses a variable lives. lives ← 3. The player loses one life. Which statement correctly updates lives?"
    },
    code: "lives ← 3",
    options: {
      zh: ["lives ← 1", "lives == lives - 1", "lives ← lives - 1", "lives - 1"],
      en: ["lives ← 1", "lives == lives - 1", "lives ← lives - 1", "lives - 1"]
    },
    answer: "lives ← lives - 1",
    misconception: "updating_variable",
    hint: {
      zh: "你必须将新值赋回给变量。",
      en: "You must assign the new value back to the variable."
    }
  },
  {
    id: "Q10",
    level: 2,
    type: "short_answer",
    prompt: {
      zh: "一个标记为 x 的盒子包含 2。执行 x ← x * 3 后，盒子里是什么值？",
      en: "A box labeled x contains 2. After x ← x * 3, what value is in the box?"
    },
    code: "x ← 2\nx ← x * 3",
    answer: "6",
    misconception: "expression_update",
    hint: {
      zh: "使用盒子中的当前值来计算新值。",
      en: "Use the current value in the box to calculate the new one."
    },
    visual: {
      before: { x: 2 },
      after: { x: 6 }
    }
  },
  {
    id: "Q11",
    level: 1,
    type: "true_false",
    prompt: {
      zh: "变量在使用之前必须有一个值。",
      en: "A variable must have a value before it can be used."
    },
    answer: true,
    misconception: "uninitialized_variable",
    hint: {
      zh: "变量在表达式中使用之前需要有一个存储的值。",
      en: "A variable needs a stored value before it can be used in an expression."
    }
  },
  {
    id: "Q12",
    level: 3,
    type: "multiple_choice",
    prompt: {
      zh: "执行下面的程序后，x 的值是多少？",
      en: "After executing the following program, what is the value of x?"
    },
    code: "x ← 5\ny ← x\ny ← 12",
    options: {
      zh: ["5", "12", "17", "undefined"],
      en: ["5", "12", "17", "undefined"]
    },
    answer: "5",
    misconception: "variables_are_independent",
    hint: {
      zh: "改变一个变量不会改变另一个变量，除非重新赋值。",
      en: "Changing one variable does not change another unless reassigned."
    },
    visual: {
      before: { x: 5, y: undefined },
      after: { x: 5, y: 12 }
    }
  },
  {
    id: "Q13",
    level: 2,
    type: "short_answer",
    prompt: {
      zh: "执行下面的程序后，count 的最终值是多少？",
      en: "After executing the following program, what is the final value of count?"
    },
    code: "count ← 1\ncount ← count + 1\ncount ← count + 1",
    answer: "3",
    misconception: "step_by_step_update",
    hint: {
      zh: "逐行更新变量。",
      en: "Update the variable one line at a time."
    },
    visual: {
      before: { count: 1 },
      after: { count: 3 }
    }
  },
  {
    id: "Q14",
    level: 2,
    type: "multiple_choice",
    prompt: {
      zh: "哪个语句能正确地将 score 增加 5？",
      en: "Which statement correctly increases score by 5?"
    },
    options: {
      zh: ["score + 5", "score == score + 5", "score ← score + 5", "5 ← score"],
      en: ["score + 5", "score == score + 5", "score ← score + 5", "5 ← score"]
    },
    answer: "score ← score + 5",
    misconception: "updating_variable",
    hint: {
      zh: "必须将新值赋回给变量。",
      en: "The new value must be assigned back to the variable."
    }
  },
  {
    id: "Q15",
    level: 1,
    type: "multiple_choice",
    prompt: {
      zh: "执行下面的程序时，问题是什么？",
      en: "When executing the following program, which is the problem?"
    },
    code: "total ← 10\ntotal ← total + five",
    options: {
      zh: ["total 不能被更新", "five 没有定义为变量", "10 不能被加", "total 应该使用 =="],
      en: ["total cannot be updated", "five is not defined as a variable", "10 cannot be added", "total should use =="]
    },
    answer: {
      zh: "five 没有定义为变量",
      en: "five is not defined as a variable"
    },
    misconception: "using_undefined_variable",
    hint: {
      zh: "所有使用的变量都必须被定义。",
      en: "All variables used must be defined."
    }
  },
  {
    id: "Q16",
    level: 2,
    type: "multiple_choice",
    prompt: {
      zh: "一个计时器从 30 秒开始。每秒，计时器应该减少 1。哪个语句能正确更新计时器？",
      en: "A timer starts at 30 seconds. Every second, the timer should decrease by 1. Which statement correctly updates the timer?"
    },
    code: "timer ← 30",
    options: {
      zh: ["timer - 1", "timer == timer - 1", "timer ← timer - 1", "timer ← 1 - timer"],
      en: ["timer - 1", "timer == timer - 1", "timer ← timer - 1", "timer ← 1 - timer"]
    },
    answer: "timer ← timer - 1",
    misconception: "assignment_required",
    hint: {
      zh: "更新必须存储新值。",
      en: "An update must store the new value."
    }
  },
  {
    id: "Q17",
    level: 3,
    type: "short_answer",
    prompt: {
      zh: "执行下面的程序后，c 的值是多少？",
      en: "After executing the following program, what is the value of c?"
    },
    code: "a ← 2\nb ← 3\nc ← a + b\na ← 10",
    answer: "5",
    misconception: "thinking_variables_auto_update",
    hint: {
      zh: "变量在赋值时存储值。",
      en: "Variables store values at the time of assignment."
    },
    visual: {
      before: { a: 2, b: 3, c: undefined },
      after: { a: 10, b: 3, c: 5 }
    }
  },
  {
    id: "Q18",
    level: 1,
    type: "multiple_choice",
    prompt: {
      zh: "哪个选项最好地描述了什么是变量？",
      en: "Which best describes what a variable is?"
    },
    options: {
      zh: ["一个数学方程", "一个存储值的容器", "一个比较语句", "一个固定数字"],
      en: ["A math equation", "A container that stores a value", "A comparison statement", "A fixed number"]
    },
    answer: {
      zh: "一个存储值的容器",
      en: "A container that stores a value"
    },
    misconception: "definition_of_variable",
    hint: {
      zh: "想象一个可以改变里面内容的标签盒子。",
      en: "Think of a labeled box that can change what is inside."
    }
  },
  {
    id: "Q19",
    level: 2,
    type: "short_answer",
    prompt: {
      zh: "执行下面的程序后，score 的值是多少？",
      en: "After executing the following program, what is the value of score?"
    },
    code: "score ← 4\nscore ← score * 2",
    answer: "8",
    misconception: "verbalizing_assignment",
    hint: {
      zh: "使用旧值来计算新值。",
      en: "Describe how the old value is used to create a new one."
    },
    visual: {
      before: { score: 4 },
      after: { score: 8 }
    }
  },
  {
    id: "Q20",
    level: 1,
    type: "multiple_choice",
    prompt: {
      zh: "哪种情况最适合使用变量？",
      en: "Which situation best requires a variable?"
    },
    options: {
      zh: ["打印数字 5 一次", "存储玩家不断变化的分数", "显示固定标题", "显示相同的图片"],
      en: ["Printing the number 5 once", "Storing a player's changing score", "Displaying a fixed title", "Showing the same image"]
    },
    answer: {
      zh: "存储玩家不断变化的分数",
      en: "Storing a player's changing score"
    },
    misconception: "when_to_use_variables",
    hint: {
      zh: "当值可能改变时使用变量。",
      en: "Variables are used when values can change."
    }
  }
]


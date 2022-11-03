
var registerCount = 3;
var registerNames = ["A", "B", "C"];

var locationTypeStaticMemory = 0;
var locationTypeStack = 1;
var locationTypeRegister = 2;
var locationTypeLiteral = 3;

function MakeVariable(name, locationType, locationOffset)
{
	return [name, locationType, locationOffset];
}

function MakeContext()
{
	return { vars: [], stackSize: 0, staticSize: 0, codeSize: 0, registersSize: 0 };
}

function FindVariable(name, contextStack)
{
	var i = contextStack.length - 1;	
	var j = 0;
	var found = false;
	
	while(i >= 0 && !found)
	{
		j = 0;
		
		while(j < contextStack[i].vars.length && !found)
		{
			if(name == contextStack[i].vars[j][0]) { found = true; }
			else { j ++; }
		}
		
		if(!found) { i --; }
	}
	
	if(found) { return contextStack[i].vars[j]; }
	else { return null; }
}

function CodeGenReference(variable)
{
	if(variable[1] == locationTypeRegister)
	{ return "" + registerNames[variable[2]]; }
	else if(variable[1] == locationTypeStack)
	{ return "SP[" + variable[2] + "]"; }
	else // variable[1] == locationTypeStaticMemory || variable[1] == locationTypeLiteral
	{ return variable[0]; }
}

function CodeGenDealocation(variable, context)
{
	var code = "";
	
	if(variable[1] == locationTypeRegister) { context.registersSize --; }
	else if(variable[1] == locationTypeStack)
	{
		code += ":" + context.codeSize + ":DESMONTA\n";
		context.stackSize --;
		context.codeSize ++;
	}
	
	return code;
}

function CodeGenExpressionRecursive(node, contextStack)
{
	var context = contextStack[contextStack.length - 1];
	
	var memory = "";
	var code = "";
	var variable = null;
	
	console.log("Generating expression code for " + NodeTypeName(node.type));
	
	var resultLocation;
	var resultOffset;
	var resultVariable = null;
	
	if(node.type == nodeTypeLiteral)
	{
		resultVariable = MakeVariable(node.content, locationTypeLiteral, 0);
	}
	else if(node.type == nodeTypeVar)
	{
		var findResult = FindVariable(node.content, contextStack);
		if(findResult != null) { resultVariable = findResult; }
		else { return null; }
	}
	else if(node.type == nodeTypeExpression || node.type == nodeTypeParenthesis)
	{
		var subExpressionResult = CodeGenExpressionRecursive(node.childs[0], contextStack);
		
		if(subExpressionResult == null)
		{
			return null;
		}
		else
		{
			// add the generated code and memory cells
			memory += subExpressionResult[0];
			code += subExpressionResult[1];
			
			// pass the returned variable
			resultVariable = subExpressionResult[2];
			

		}
		
	}
	else
	{
	
		if(context.registersSize >= registerCount)
		{
			resultVariable = MakeVariable("",locationTypeStack, context.stackSize);
			resultLocation = locationTypeStack;
			resultOffset = context.stackSize;
			code += ":" + context.codeSize + ":MONTA\n";		
			context.stackSize ++;
			context.codeSize ++;
		}
		else
		{
			resultVariable = MakeVariable("",locationTypeRegister, context.registersSize);		
			resultLocation = locationTypeRegister;
			resultOffset = context.registersSize;
			context.registersSize ++;
		}
	
		
		if(node.type == nodeTypeAdd || node.type == nodeTypeSub || 
		        node.type == nodeTypeMul || node.type == nodeTypeDiv)
		{
			var subExpressionLeftResult = CodeGenExpressionRecursive(node.childs[0], contextStack);
			var subExpressionRightResult = CodeGenExpressionRecursive(node.childs[1], contextStack);
			
			if(subExpressionLeftResult == null || subExpressionRightResult == null) { return null; }
			
			memory += subExpressionLeftResult[0];
			code += subExpressionLeftResult[1];
			
			memory += subExpressionRightResult[0];
			code += subExpressionRightResult[1];

			var subExpressionLeftVariable = subExpressionLeftResult[2];
			var subExpressionRightVariable = subExpressionRightResult[2];
			
			var op;
			if(node.type == nodeTypeAdd) { op = "SUMA"; }
			else if(node.type == nodeTypeSub) { op = "RESTA"; }
			else if(node.type == nodeTypeMul) { op = "MULTIPLICA"; }
			else // node.type == nodeTypeDiv
			{ op = "DIVIDE"; }
			
			code += ":" + context.codeSize + ":" + op + " " +
					CodeGenReference(resultVariable) + " " +
					CodeGenReference(subExpressionLeftVariable) + " " +
					CodeGenReference(subExpressionRightVariable) + "\n";
					
			context.codeSize ++;

			code += CodeGenDealocation(subExpressionLeftVariable, contextStack[contextStack.length - 1]);
			code += CodeGenDealocation(subExpressionRightVariable, contextStack[contextStack.length - 1]);		
		}
		
	}	
	
	return [memory, code, resultVariable];
	
}

function CodeGenRecursive(node, contextStack)
{
	console.log("Generating code for " + NodeTypeName(node.type));
	
	var memory = "";
	var code = "";
	
	if(node == null)
	{
		return null;
	}
	else if(node.type == nodeTypeFuncDeclaration)
	{
		var result = CodeGenRecursive(node.childs[2], contextStack);
		
		if(result != null)
		{
			memory += result[0];
			code += result[1];
			
			return [memory, code];
		}
		else
		{
			return null;
		}		
	}
	else if(node.type == nodeTypeIf)
	{
		var expressionResult = CodeGenExpressionRecursive(node.childs[0], contextStack);
		
		memory += expressionResult[0];
		code += expressionResult[1];
		
		var endIfTag = "endIf" + contextStack[contextStack.length - 1].codeSize;
		code += ":" + contextStack[contextStack.length - 1].codeSize + ":" +
		        "SALTASIFALSO " + endIfTag + " " +
				CodeGenReference(expressionResult[2]) + "\n";
				
		contextStack[contextStack.length - 1].codeSize ++;
		
		var blockResult = CodeGenRecursive(node.childs[1], contextStack);

		memory += blockResult[0];
		code += blockResult[1];
		
		code += endIfTag + ":" + contextStack[contextStack.length - 1].codeSize + ":MUEVE A A\n";
				
		contextStack[contextStack.length - 1].codeSize ++;
		
		code += CodeGenDealocation(expressionResult[2], contextStack[contextStack.length - 1]);
		
		return [memory, code];
	}
	else if(node.type == nodeTypeWhile)
	{
		var whileTag = "while" + contextStack[contextStack.length - 1].codeSize;
		var endWhileTag = "endWhile" + contextStack[contextStack.length - 1].codeSize;
		code += whileTag + ":" + contextStack[contextStack.length - 1].codeSize + ":" +
		        "MUEVE A A\n";
		contextStack[contextStack.length - 1].codeSize ++;
		
		var expressionResult = CodeGenExpressionRecursive(node.childs[0], contextStack);
		
		memory += expressionResult[0];
		code += expressionResult[1];
		
		code += ":" + contextStack[contextStack.length - 1].codeSize + ":" +
		        "SALTASIFALSO " + endWhileTag + " " +
				CodeGenReference(expressionResult[2]) + "\n";
				
		contextStack[contextStack.length - 1].codeSize ++;
		
		var blockResult = CodeGenRecursive(node.childs[1], contextStack);

		memory += blockResult[0];
		code += blockResult[1];
		
		code += ":" + contextStack[contextStack.length - 1].codeSize + ":SALTA " + whileTag + "\n";
				
		contextStack[contextStack.length - 1].codeSize ++;

		code += endWhileTag + ":" + contextStack[contextStack.length - 1].codeSize + ":MUEVE A A\n";
				
		contextStack[contextStack.length - 1].codeSize ++;
		
		code += CodeGenDealocation(expressionResult[2], contextStack[contextStack.length - 1]);
		
		return [memory, code];		
	}	
	else if(node.type == nodeTypeProgram || node.type == nodeTypeBlock)
	{
		var newContext = MakeContext();
		contextStack.push(newContext);
		
		if(contextStack.length >= 2)
		{
			var c1 = contextStack[contextStack.length - 1];
			var c2 = contextStack[contextStack.length - 2];
			c1.registerSize = c2.registerSize;
			c1.staticSize = c2.staticSize;
			c1.stackSize = c2.stackSize;
			c1.codeSize = c2.codeSize;
		}
		
		var i = 0;
		var error = false;
		
		while(i < node.childs.length && !error)
		{		
			var result = CodeGenRecursive(node.childs[i], contextStack);
			
			if(result != null)
			{
				memory += result[0];
				code += result[1];
				
				i ++;
			}
			else
			{
				error = true;
			}

			
		}
		
		contextStack.pop();		
		
		if(error) { return null; }
		else { return [memory, code]; }
	}
	else if(node.type == nodeTypeVarDeclaration)
	{
		if(contextStack.length == 1)
		{
			var previous = FindVariable(node.childs[1].content, contextStack);

			if(previous != null)
			{
				console.log("Error: Ya existe una variable con el mismo nombre cerca de " + node.childs[1].content);
				
				return null;
			}

			// We are in the global context so the allocation is static
			
			var variable = MakeVariable(node.childs[1].content, locationTypeStaticMemory, contextStack[0].staticSize);				
			contextStack[0].vars.push(variable);
			contextStack[0].staticSize ++;
			
			memory += variable[0] + ":" + variable[2] + ":0\n";
			
			return [memory, code];
				
			
		}
		else
		{
			// We are in a local context so the allocation is in the stack
			
			console.log("Local variable");
			
			var variable = MakeVariable(node.childs[1].content, locationTypeStack, contextStack[contextStack.length - 1].stackSize);				
			contextStack[contextStack.length - 1].vars.push(variable);
			contextStack[contextStack.length - 1].stackSize ++;
			
			code += ":" + contextStack[contextStack.length - 1].codeSize + ":MONTA\n"
			
			contextStack[contextStack.length - 1].codeSize ++;
			
			return [memory, code];
		}
	}
	else if(node.type == nodeTypeAssignation)
	{
		var expressionResult = CodeGenExpressionRecursive(node.childs[1], contextStack);
		
		if(expressionResult != null)
		{
			memory += expressionResult[0];
			code += expressionResult[1];
			
			var expressionVar = expressionResult[2];
			
			var variable = FindVariable(node.childs[0].content, contextStack);
			
			if(variable == null)
			{
				console.log("Variable en el lado izquierdo de la asignación no asignada cerca de " + node.childs[0].content);
				
				return null;
			}
			else
			{
				code += ":" + contextStack[contextStack.length - 1].codeSize + ":MUEVE " +
						CodeGenReference(variable) + " " + CodeGenReference(expressionVar) + "\n";
				
				
				contextStack[contextStack.length - 1].codeSize++;		

				code += CodeGenDealocation(expressionVar, contextStack[contextStack.length - 1]);
				
				return [memory, code];
			}
		}
		else
		{
			return null;
		}
		
	}
	else
	{
		return [memory, code];
	}
}


function CodeGen(tree)
{
	var contextStack = [];
	
	return CodeGenRecursive(tree, contextStack);
	

	
}
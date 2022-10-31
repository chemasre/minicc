
const nodeTypeProgram					= 0;

const nodeTypeVarDeclaration			= 1;
const nodeTypeVarDeclarationType		= 2;
const nodeTypeVarDeclarationName		= 3;

const nodeTypeFuncDeclaration			= 4;
const nodeTypeFuncDeclarationReturnType	= 5;
const nodeTypeFuncDeclarationName		= 6;

const nodeTypeBlock			= 8;

const nodeTypeAssignation				= 9;
const nodeTypeAssignationLeftSide		= 10;
const nodeTypeExpression				= 11;

const nodeTypeMinusSign = 12;
const nodeTypeAdd 		= 13;
const nodeTypeSub 		= 14;
const nodeTypeMul 		= 15;
const nodeTypeDiv 		= 16;
const nodeTypeParenthesis = 17;
const nodeTypeVar = 18;
const nodeTypePlusSign = 19;

const nodeTypeLiteral = 20;

const nodeTypeIf = 21;
const nodeTypeWhile = 22;

const identifierTypeVarOrFunction = 0;
const identifierTypeType = 1;


function GetIdentifierType(s)
{
	var type;
	
	if(s == "void" || s == "int") { type = identifierTypeType; }
	else { type = identifierTypeVarOrFunction; }
	
	return type;
	
}


function NodeTypeName(type)
{
	if(type == nodeTypeProgram) { return "Program(PRG)"}
	else if(type == nodeTypeVarDeclaration) { return "VarDeclaration(VD)"}
	else if(type == nodeTypeVarDeclarationType) { return "VarDeclarationType(VDT)"}
	else if(type == nodeTypeVarDeclarationName) { return "VarDeclarationName(VDN)"}
	else if(type == nodeTypeFuncDeclaration) { return "FunDeclaration(FD)"}
	else if(type == nodeTypeFuncDeclarationReturnType) { return "FunDeclarationReturnType(FDR)"}
	else if(type == nodeTypeFuncDeclarationName) { return "FunDeclarationName(FDN)"}
	else if(type == nodeTypeBlock) { return "Block(BLK)"}
	else if(type == nodeTypeAssignation) { return "Assignation(AS)"}
	else if(type == nodeTypeAssignationLeftSide) { return "AssignationLeftSide(ASL)"}
	else if(type == nodeTypeExpression) { return "Expression(EXP)"}
	else if(type == nodeTypeMinusSign) { return "MinusSign(MS)"}
	else if(type == nodeTypeAdd) { return "Add(ADD)"}
	else if(type == nodeTypeSub) { return "Sub(SUB)"}
	else if(type == nodeTypeMul) { return "Mul(MUL)"}
	else if(type == nodeTypeDiv) { return "Div(DIV)"}
	else if(type == nodeTypeParenthesis) { return "Parentheses(PAR)"}
	else if(type == nodeTypeVar) { return "Variable(VAR)"}
	else if(type == nodeTypePlusSign) { return "PlusSign(PS)"}
	else if(type == nodeTypeLiteral) { return "Literal(LIT)"}
	else if(type == nodeTypeIf) { return "If(IF)"}
	else if(type == nodeTypeWhile) { return "While(WHL)"}
	else { return "Unknown"; }
}

function PrintExpression(tokens)
{
	var text = "";

	for(var i = 0;i < tokens.length; i ++)
	{
		text = text + i + ":" + TokenTypeName(tokens[i][0]) + ":" + tokens[i][1] + "\n";
	}
	
	console.log(text);
}

function SkipSeparators(tokens, i)
{
	var nonSeparatorFound  = false;
	
	while(i < tokens.length && !nonSeparatorFound)
	{
		if(tokens[i][0] == tokenTypeSeparator)
		{
			console.log("Skipping separator");
			i ++;
		}
		else
		{
			console.log("Found non separator");
			nonSeparatorFound = true;
		}
	}
	
	return i;
}

function IsOperatorTokenType(t)
{
	return t == tokenTypeAddition || t == tokenTypeMinus || t == tokenTypeAsterisk || t == tokenTypeDivision || t == tokenTypeOpenRoundBracket;
}

function FindLeastPrioritaryOperator(tokens, start, end)
{
	var leastPosition = -1;
	var least = null;
	
	var i = start;
	
	while(i <= end)
	{
		FindNextOperator(tokens, start);
		
		
	}
	
	return leastPosition;
	
}

function FindExpressionEnd(tokens, i)
{
	var openBrackets = 0;
	var foundEnd = false;
	
	while(i < tokens.length && !foundEnd)
	{
		if(tokens[i][0] == tokenTypeEndSentence) { foundEnd = true; }
		else if(tokens[i][0] == tokenTypeOpenRoundBracket) { openBrackets ++; }
		else if(tokens[i][0] == tokenTypeCloseRoundBracket)
		{	if(openBrackets == 0) { foundEnd = true; }
			else { openBrackets --; }
		}
		
		if(!foundEnd) { i ++; }
		   
	}
	
	if(foundEnd) { return i; }
	else { return -1; }
}

function FindMatchingRoundBracket(tokens, i)
{
	var openBrackets = 0;
	var found = false;
	
	while(i < tokens.length && !found)
	{
		if(tokens[i][0] == tokenTypeOpenRoundBracket) { openBrackets ++; }
		else if(tokens[i][0] == tokenTypeCloseRoundBracket)
		{	if(openBrackets == 0) { found = true; }
			else { openBrackets --; }
		}
		
		if(!found) { i ++; }
	}
	
	if(found) { return i; }
	else { return -1; }
	
}

function GetOperatorTokenTypePriority(tokenType, isUnary)
{
	if(!isUnary)
	{
		if(tokenType == tokenTypeAddition || tokenType == tokenTypeMinus) { return 0; }
		else if(tokenType == tokenTypeAsterisk || tokenType == tokenTypeDivision) { return 1; }
		else if(tokenType == tokenTypeOpenRoundBracket) { return 2; }
	}
	else
	{
		if(tokenType == tokenTypeAddition || tokenType == tokenTypeMinus) { return 3; }	
	}
	
	return 0;
}

function BuildExpressionRecursive(tokens)
{
	console.log("Build expression starts --------------------");
	PrintExpression(tokens);

	var node = null;

	// Step1: Identify the least prioritary operator

	var nextOperatorCanBeUnary = true;
	
	var operatorFound = false;
	var isUnary = false;
	
	var lowestIsUnary;
	var lowestPosition = 0;
	var lowestPriority = 100;
	
	var error = false;
	var errorText = "";
	
	var i = 0;
	
	while(i < tokens.length && !error)
	{
		console.log("Building expression: Index is" + i + " token type is " + TokenTypeName(tokens[i][0]) + " content is " + tokens[i][1]);
		
		if(tokens[i][0] == tokenTypeIdentifier && GetIdentifierType(tokens[i][1]) == identifierTypeVarOrFunction || tokens[i][0] == tokenTypeLiteral)
		{
			nextOperatorCanBeUnary = false;
			
			i ++;
		}
		else if(IsOperatorTokenType(tokens[i][0]))
		{
			// Found an operator
		
			operatorFound = true;
			
			isUnary = false;
			
			if(nextOperatorCanBeUnary && (tokens[i][0] == tokenTypeAddition || tokens[i][0] == tokenTypeMinus))
			{
				isUnary = true;
			}
			
			// See if its priority is less
			
			var priority = GetOperatorTokenTypePriority(tokens[i][0], isUnary);
			
			console.log("Priority is " + priority);
			
			if(priority < lowestPriority)
			{
				lowestPosition = i;
				lowestPriority = priority;
				lowestIsUnary = isUnary;
			}
			
			// Skip to the next
			
			if(tokens[i][0] == tokenTypeOpenRoundBracket)
			{
				i = FindMatchingRoundBracket(tokens, i + 1) + 1;
				
				
				
				nextOperatorCanBeUnary = false;
			}
			else
			{			
				i ++;
			}
		}
		else
		{
			error = true;
			errorText = "Error: Unexpected secuence found in expression at " + i;
		}

	}

	if(error)
	{
		// Nothing
	}
	else if(operatorFound)
	{
		console.log("Lowest operator is " + TokenTypeName(tokens[lowestPosition][0]));

		var nodeType = null;
		var tokenType = tokens[lowestPosition][0];
		
		if(lowestIsUnary)
		{
			if(tokenType == tokenTypeMinus) { nodeType = nodeTypeMinusSign; }
			else // tokenType == tokenTypeAddition
			{ nodeType = nodeTypePlusSign; }
		}
		else
		{
			if(tokenType == tokenTypeMinus) { nodeType = nodeTypeSub; }
			else if(tokenType == tokenTypeAddition) { nodeType = nodeTypeAdd; }
			else if(tokenType == tokenTypeAsterisk) { nodeType = nodeTypeMul; }
			else if(tokenType == tokenTypeDivision) { nodeType = nodeTypeDiv; }
			else // tokenType == tokenTypeOpenRoundBracket
			{ nodeType = nodeTypeParenthesis; }


		}
		
		node = { type: nodeType, childs: [], content: null };
		
		var subExpressionLeft = null;
		var subExpressionRight = null;
		var nodeLeft = null;
		var nodeRight = null;

		if(lowestIsUnary)
		{
			console.log("Building right side of unary operator that goes from " + (lowestPosition + 1) + " to " + (tokens.length - 1));
			subExpressionRight = SliceExpression(tokens, lowestPosition + 1, tokens.length - 1);			
			
			
			nodeRight = BuildExpressionRecursive(subExpressionRight);
			
			if(nodeRight != null)
			{			
				node.childs.push(nodeRight);
			}
		}
		else if(tokens[lowestPosition][0] == tokenTypeOpenRoundBracket)
		{
			var parenthesisClosePosition = FindMatchingRoundBracket(tokens, lowestPosition + 1);
			
			if(parenthesisClosePosition < 0)
			{
				error = true;
				errorText = "Error: No matching parenthesis found in expression";
			}
			else
			{
				var subExpression = SliceExpression(tokens, lowestPosition + 1, parenthesisClosePosition - 1);
				
				var childNode = BuildExpressionRecursive(subExpression);
				
				if(childNode != null)
				{
					node.childs.push(childNode);
				}
			}
			
		}
		else
		{
			subExpressionLeft = SliceExpression(tokens, 0, lowestPosition - 1);
			subExpressionRight = SliceExpression(tokens, lowestPosition + 1, tokens.length - 1);

			console.log("Building left side of binary operator that goes from " + 0 + " to " + (lowestPosition - 1));			

			console.log("Building right side of binary operator that goes from " + (lowestPosition + 1) + " to " + (tokens.length - 1));			

			nodeLeft = BuildExpressionRecursive(subExpressionLeft);
			nodeRight = BuildExpressionRecursive(subExpressionRight);

			if(nodeLeft != null)
			{			
				node.childs.push(nodeLeft);
			}
			else
			{
				// I add this to avoid the next stage thinking the right node is the left
				// when an error is found
				//node.childs.push(null);			
			}

			if(nodeRight != null)
			{
				node.childs.push(nodeRight);
			}
		}
		
		
	}
	else
	{
		// No operator found
		
		if(tokens.length > 0)
		{
			var nodeType = null;
			var tokenType = tokens[0][0];
			var tokenContent = tokens[0][1];
			
			if(tokenType == tokenTypeIdentifier && GetIdentifierType(tokenContent) == identifierTypeVarOrFunction) { nodeType = nodeTypeVar; }
			else // tokenType == tokenTypeLiteral
			{ nodeType = nodeTypeLiteral; }
			
			node = { type: nodeType, childs: [], content: null };
		}
		else
		{
			error = true;
			errorText = "Error: Expression is empty";
		}
	}
	
	if(!error)
	{
		return node;
	}
	else
	{
		console.log(errorText);
	
		return null;
	}
	
}

function SliceExpression(tokens, start, end)
{
	console.log("Slicing from " + start + " to " + end + "---------");
	PrintExpression(tokens);

	var result = [];
	
	
	for(var i = start; i <= end; i ++)
	{
		if(tokens[i][0] != tokenTypeSeparator)
		{
			result.push(tokens[i]);
		}
	}
	
	console.log("Result---------");
	PrintExpression(result);

	return result;
}

function BuildExpression(tokens, i)
{
	var node = null;
	
	var error = false;
	var errorText = "";
	
	var expressionBuilt = false;
	
	var node = { type: nodeTypeExpression, childs: [], content: null };

	
	console.log("Building expression");

	var start = i;	
	var end = FindExpressionEnd(tokens, i);
	
    if(end < 0)
	{
		error = true;
		errorText = "Error: End of expression not found near " + i;
	}
	else
	{
		console.log("End of expression found at " + end);
		
		var expression = SliceExpression(tokens, start, end - 1);		
		var result = BuildExpressionRecursive(expression);
		
		if(result != null)
		{
			node.childs.push(result);
			
			i = end + 1;
		}
	} 
	
	if(error)
	{
		console.log(errorText);
		
		return [null, i];
	}
	else
	{
		return [node, i];
	}



}

function BuildBlock(tokens, i)
{
	var node = { type: nodeTypeBlock, childs: [], content: null };
	
	var error = false;
	var errorText = "";
	
	console.log("Building block");
	
	i = SkipSeparators(tokens, i);
	
	if(i < tokens.length)
	{
		if(tokens[i][0] == tokenTypeOpenClaudator)
		{
			console.log("Block start found");
			
			var blockBuilt = false;
			
			i = i + 1;
			
			
			while(i < tokens.length && !blockBuilt && !error)
			{
				console.log("Processing token " + i + " type " + TokenTypeName(tokens[i][0]));

				if(tokens[i][0] == tokenTypeSeparator)
				{
					console.log("Skipping separator");
					i ++;
				}
				else if(tokens[i][0] == tokenTypeIf || tokens[i][0] == tokenTypeWhile)
				{
					var nodeType = null;
					
					if(tokens[i][0] == tokenTypeIf) { nodeType = nodeTypeIf; }
					else // tokens[i][1] == "while"
					{ nodeType = nodeTypeWhile; }
					
					var controlFlowNode = {type: nodeType, childs:[], content: null};
					
					i = i + 1;
					
					i = SkipSeparators(tokens, i);
					
					if(i < tokens.length)
					{						
						if(tokens[i][0] == tokenTypeOpenRoundBracket)
						{
							i = i + 1;
							
							if(i < tokens.length)
							{							
								var buildResult = BuildExpression(tokens, i);
								
								if(buildResult[0] != null)
								{
									controlFlowNode.childs.push(buildResult[0]);
								}
								
								node.childs.push(controlFlowNode);
								
								i = buildResult[1] + 1;
								
								buildResult = BuildBlock(tokens, i);
								
								if(buildResult[0] != null)
								{
									controlFlowNode.childs.push(buildResult[0]);
								}
								
								i = buildResult[1] + 1;

								console.log("Expression built, next token " + i);
							}
							else
							{
								error = true;
								errorText = "Error: End of file reached while looking for control flow instruction expression close bracket near " + i;
							}
							
							
						}
						else
						{
								error = true;
								errorText = "Error: Unexpected sequence found when looking for open bracket near " + i;
						}
						
					}
					else
					{
						error = true;
						errorText = "Error: End of file reached while looking for control flow instruction expression near " + i;
					}					
				}
				else if(tokens[i][0] == tokenTypeIdentifier && GetIdentifierType(tokens[i][1]) == identifierTypeType && i < tokens.length - 3)
				{
					// It should be a local variable declaration
					
					console.log("Identifier found");
					
					if(	tokens[i + 1][0] == tokenTypeSeparator &&
						tokens[i + 2][0] == tokenTypeIdentifier && GetIdentifierType(tokens[i + 2][1]) == identifierTypeVarOrFunction)
					{
						if(tokens[i + 3][0] == tokenTypeEndSentence)
						{
							// Local declaration found
							
							console.log("Local variable declaration found");
			
							var declarationNode = {type: nodeTypeVarDeclaration, childs:[], content: null};
							declarationNode.childs.push({type: nodeTypeVarDeclarationType, childs: null, content:tokens[i][1]});
							declarationNode.childs.push({type: nodeTypeVarDeclarationName, childs: null, content:tokens[i + 2][1]});
												
							node.childs.push(declarationNode);
							
							i = i + 4;
						}
						else
						{
							error = true;
							errorText = "Error: Se esperaba un símbolo de fin de sentencia cerca de " + tokens[i][1];
						}
					}
					else
					{
						error = true;
						errorText = "Error: Se esperaba una declaración de variable cerca de " + tokens[i][1];
					}
				}
				else if(tokens[i][0] == tokenTypeIdentifier && GetIdentifierType(tokens[i][1]) == identifierTypeVarOrFunction && i < tokens.length - 3)
				{
					// It should be an assignation or a function call
					
					var identifierToken = i;
				
					i = i + 1;
									
					i = SkipSeparators(tokens, i);
					
					if(tokens[i][0] == tokenTypeEqual)
					{
						console.log("Assignation found");
						
						i = i + 1;
						
						var assignationNode = {type: nodeTypeAssignation, childs:[], content: null};
						assignationNode.childs.push({type: nodeTypeAssignationLeftSide, childs: null, content:tokens[identifierToken][1]});
						
						if(i < tokens.length)
						{						
							i = SkipSeparators(tokens, i);
							
							var buildResult = BuildExpression(tokens, i);
							
							if(buildResult[0] != null)
							{
								assignationNode.childs.push(buildResult[0]);
							}
							
							node.childs.push(assignationNode);
							
							i = buildResult[1] + 1;
							
							console.log("Expression built, next token " + i);
							
							
						}
						else
						{
							error = true;
							errorText = "Error: End of file reached while looking for right side of assination near " + i;
						}
					}
				}
				else if(tokens[i][0] == tokenTypeCloseClaudator)
				{
					blockBuilt = true;
					
					i ++;
				}
				else
				{
					error = true;
					errorText = "Error: Unexpected token " + i;  
				}

				
			}
			
		}
	}
	else
	{
		error = true;
		errorText = "Error: End of file found when looking for block open symbol";  
	}
	
	
	if(error)
	{
		console.log(errorText);
		
		return [null, i];
	}
	else
	{
		return [node, i];
	}
}


function BuildTree(tokens)
{
	var node = { type: nodeTypeProgram, childs: [], content: null };
	
	var i = 0;
	var error = false;
	var errorText = "";
	
	
	while(i < tokens.length && !error)
	{
		console.log("Processing token " + i + " type " + TokenTypeName(tokens[i][0]));

		if(tokens[i][0] == tokenTypeSeparator)
		{
			console.log("Skipping separator");
			i ++;
		}
		else if(tokens[i][0] == tokenTypeIdentifier && GetIdentifierType(tokens[i][1]) == identifierTypeType && i < tokens.length - 3)
		{
			// It can be a declaration or a function
			
			console.log("Identifier found");
			
			if(	tokens[i + 1][0] == tokenTypeSeparator &&
				tokens[i + 2][0] == tokenTypeIdentifier && GetIdentifierType(tokens[i + 2][1]) == identifierTypeVarOrFunction)
			{
				if(tokens[i + 3][0] == tokenTypeEndSentence)
				{
					// Is a variable declaration
					
					console.log("Variable declaration found");
	
					var declarationNode = {type: nodeTypeVarDeclaration, childs:[], content: null};
					declarationNode.childs.push({type: nodeTypeVarDeclarationType, childs: null, content:tokens[i][1]});
					declarationNode.childs.push({type: nodeTypeVarDeclarationName, childs: null, content:tokens[i + 2][1]});
										
					node.childs.push(declarationNode);
					
					i = i + 4;
				}
				else if(tokens[i + 3][0] == tokenTypeOpenRoundBracket && i < tokens.length - 4)
				{
					// It can be a function declaration
					
					console.log("Function declaration found");

					if(tokens[i + 4][0] == tokenTypeCloseRoundBracket)
					{					
						var functionDeclarationNode = {type: nodeTypeFuncDeclaration, childs:[], content: null};
						functionDeclarationNode.childs.push({type: nodeTypeFuncDeclarationReturnType, childs: null, content:tokens[i][1]});
						functionDeclarationNode.childs.push({type: nodeTypeFuncDeclarationName, childs: null, content:tokens[i + 2][1]});
						
						i = i + 5;

						var buildResult = BuildBlock(tokens, i);
						
						if(buildResult[0] != null)
						{
							functionDeclarationNode.childs.push(buildResult[0]);
							node.childs.push(functionDeclarationNode);
						}
						
						i = buildResult[1];
						
						console.log("Bloque procesado, siguiente indice " + i);
						
					}
					else
					{
						error = true;
						errorText = "Error: Se esperaba un paréntesis de cierre cerca de " + tokens[i][1];
					}
				}
				else
				{
					error = true;
					errorText = "Error: Se esperaba una declaración de función cerca de " + tokens[i][1];
				}
			}
			else
			{
				error = true;
				errorText = "Error: Se esperaba una declaración de variable o función cerca de " + tokens[i][1];
			}
		}
		else
		{
			error = true;
			errorText = "Error: Secuencia no reconocida cerca de " + tokens[i][1] + " token type " + TokenTypeName(tokens[i][0]);
		}
	}
	
	if(error)
	{
		console.log(errorText);
		
		return null;
	}
	else
	{
		return node;
	}
}

function PrintNode(node, text, level)
{
	var result = text;

	var indent = "";
	for(var j = 0; j < level; j ++)
	{
		if(j < level - 1)
		{
			indent = indent + "    ";
		}
		else
		{
			indent = indent + "   +";
		}
	}
	
	result = result + indent + NodeTypeName(node.type);

	if(node.childs == null)
	{
		result = result + ": " + node.content + "\n";
	}
	else
	{
		result = result + "\n";
		
		for(var i = 0; i < node.childs.length; i ++)
		{
			var n = node.childs[i];
						
			result = PrintNode(n, result, level + 1);
		}

	}
	
	return result;

}

function PrintTree(node)
{
	var result = "";
	
	result = PrintNode(node, result, 0);
	
	return result;

}


var tokenTextDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var tokenTextCharacters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
							"k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
							"u", "v", "w", "x", "y", "z",
							"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
							"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
							"U", "V", "W", "X", "Y", "Z"];
							
var tokenTextSpecialCharacters = [">", "<", "=", "!", "+", "-", "*", "/", "(", ")", "[", "]", "{", "}", ";"];

var tokenTextSeparators = [" ", "\t", "\n"];

var tokenLineSeparator = "\n";


const tokenTextOpenRoundBracket		= "(";
const tokenTextCloseRoundBracket	= ")";
const tokenTextAssign 				= "=";
const tokenTextAddition 			= "+";
const tokenTextMinus				= "-";
const tokenTextAsterisk				= "*";
const tokenTextDivision				= "/";
const tokenTextLess					= "<";
const tokenTextLessEqual			= "<=";
const tokenTextGreater				= ">";
const tokenTextGreaterEqual			= ">=";
const tokenTextEqual				= "==";
const tokenTextNotEqual				= "!=";
const tokenTextIf					= "if";
const tokenTextElse					= "else";
const tokenTextWhile				= "while";
const tokenTextFor					= "for";
const tokenTextOpenClaudator		= "{";
const tokenTextCloseClaudator		= "}";
const tokenTextComma				= ",";
const tokenTextOpenSquareBracket	= "[";
const tokenTextCloseSquareBracket	= "]";
const tokenTextEndSentence			= ";";

const tokenTypeLiteral				= 0;
const tokenTypeOpenRoundBracket		= 1;
const tokenTypeCloseRoundBracket	= 2;
const tokenTypeIdentifier			= 3;
const tokenTypeAssign				= 4;
const tokenTypeAddition				= 5;
const tokenTypeMinus				= 6;
const tokenTypeAsterisk				= 7;
const tokenTypeDivision				= 8;
const tokenTypeGreater				= 9;
const tokenTypeGreaterEqual			= 10;
const tokenTypeLess					= 11;
const tokenTypeLessEqual			= 12;
const tokenTypeEqual				= 13;
const tokenTypeNotEqual				= 14;
const tokenTypeIf					= 15;
const tokenTypeElse					= 16;
const tokenTypeWhile				= 17;
const tokenTypeFor					= 18;
const tokenTypeOpenClaudator		= 19;
const tokenTypeCloseClaudator		= 20;
const tokenTypeAddressOf			= 21;
const tokenTypeComma				= 22;
const tokenTypeOpenSquareBracket	= 23;
const tokenTypeCloseSquareBracket	= 24;
const tokenTypeSeparator			= 25;
const tokenTypeEndSentence			= 26;


const parserStateWord = 0;
const parserStateSpecialWord = 1;
const parserStateLiteral = 2;
const parserStateSeparator = 3;
const parserStateOther = 4;

function IsDigit(c)
{
	var result = false;

	var i = 0;
	while(i < tokenTextDigits.length && !result)
	{
		if(tokenTextDigits[i] == c)
		{
			result = true;
		}
		else
		{
			i++;
		}
	}
		
	return result;
}

function IsCharacter(c)
{
	var result = false;

	var i = 0;
	while(i < tokenTextCharacters.length && !result)
	{
		if(tokenTextCharacters[i] == c)
		{
			result = true;
		}
		else
		{
			i++;
		}
	}
		
	return result;
}

function IsSpecialCharacter(c)
{
	var result = false;

	var i = 0;
	while(i < tokenTextSpecialCharacters.length && !result)
	{
		if(tokenTextSpecialCharacters[i] == c)
		{
			result = true;
		}
		else
		{
			i++;
		}
	}
		
	return result;
}

function IsSeparator(c)
{
	var result = false;

	var i = 0;
	while(i < tokenTextSeparators.length && !result)
	{
		if(tokenTextSeparators[i] == c)
		{
			result = true;
		}
		else
		{
			i++;
		}
	}
		
	return result;
}

function TokenTypeName(type)
{
	if(type == tokenTypeLiteral)					{ return "Literal------------(LIT)"; }
	else if(type == tokenTypeOpenRoundBracket)      { return "RoundBracketOpen---(RBO)"; }
	else if(type == tokenTypeCloseRoundBracket)     { return "RoundBracketClose--(RBC)"; }
	else if(type == tokenTypeIdentifier)            { return "Identifier---------(ID)"; }
	else if(type == tokenTypeAssign)	            { return "Assign-------------(ASG)"; }
	else if(type == tokenTypeAddition)              { return "Add----------------(ADD)"; }
	else if(type == tokenTypeMinus)	                { return "Substract----------(SUB)"; }
	else if(type == tokenTypeAsterisk)              { return "Asterisk-----------(AST)"; }
	else if(type == tokenTypeDivision)		        { return "Division-----------(DIV)"; }
	else if(type == tokenTypeGreater)               { return "Greater------------(GT)"; }
	else if(type == tokenTypeGreaterEqual)	        { return "GreaterEqual-------(GE)"; }
	else if(type == tokenTypeLess)                  { return "Less---------------(LT)"; }
	else if(type == tokenTypeLessEqual)		        { return "LessEqual----------(LE)"; }
	else if(type == tokenTypeEqual)                 { return "Equal--------------(EQ)"; }
	else if(type == tokenTypeNotEqual)		        { return "NotEqual-----------(NEQ)"; }
	else if(type == tokenTypeIf)	                { return "If-----------------(IF)"; }
	else if(type == tokenTypeElse)                  { return "Else---------------(LS)"; }
	else if(type == tokenTypeWhile)                 { return "While--------------(WHL)"; }
	else if(type == tokenTypeFor)                   { return "For----------------(FOR)"; }
	else if(type == tokenTypeOpenClaudator)         { return "ClaudatorOpen------(CLO)"; }
	else if(type == tokenTypeCloseClaudator)        { return "ClaudatorClose-----(CLC)"; }
	else if(type == tokenTypeAddressOf)             { return "Address------------(ADR)"; }
	else if(type == tokenTypeComma)                 { return "Comma--------------(COM)"; }
	else if(type == tokenTypeOpenSquareBracket)     { return "SquareBracketOpen--(SBO)"; }
	else if(type == tokenTypeCloseSquareBracket)    { return "SquareBracketClose-(SBC)"; }
	else if(type == tokenTypeSeparator)				{ return "Separator----------(SEP)"; }
	else if(type == tokenTypeEndSentence)			{ return "SentenceEnd--------(SND)"; }
	else { return "Unknown------------(UNK)"; }
	
}

function Parse(source)
{
	var tokens = Array();
	
	console.log("Tokenizing");
	
	var parserState = parserStateOther;	
	var tokenText;
	
	var i = 0;
	var line = 0;
	
	var error = false;
	var errorText;
		
	while(i < source.length && !error)	
	{
		var c = source[i];
		
		console.log("Caracter: " + c);		

		if(c == tokenLineSeparator) { line ++; }

		if(parserState == parserStateOther)
		{
			if(IsCharacter(c))
			{
				tokenText = "";
				tokenText += c;

				parserState = parserStateWord;

				i ++;
			}			
			else if(IsSpecialCharacter(c))
			{
				tokenText = "";
				tokenText += c;

				parserState = parserStateSpecialWord;
				
				i ++;
			}
			else if(IsDigit(c))
			{
				tokenText = "";
				tokenText += c;
					
				parserState = parserStateLiteral;
				
				i ++;
			}
			else if(IsSeparator(c))
			{
				tokenText = "";
				
				parserState = parserStateSeparator;
				
				i++;
			}
			else { error = true; errorText = "Símbolo " + c + " no reconocido"; }
			
		}
		else if(parserState == parserStateSeparator)
		{
			if(!IsSeparator(c))
			{
				tokens.push([tokenTypeSeparator, tokenText]);
				
				parserState = parserStateOther;
			}
			else
			{
				i ++;
			}
		}
		else if(parserState == parserStateWord)		
		{
			if(!IsCharacter(c) && !IsDigit(c) || IsSpecialCharacter(c))
			{
				var tokenType;
			
				if(tokenText == tokenTextIf)
				{
					tokenType = tokenTypeIf;
					tokenText = "";
				}
				else if(tokenText == tokenTextElse)
				{
					tokenType = tokenTypeElse;
					tokenText = "";
				}
				else if(tokenText == tokenTextWhile)
				{
					tokenType = tokenTypeWhile;
					tokenText = "";
				}
				else if(tokenText == tokenTextFor)
				{
					tokenType = tokenTypeFor;
					tokenText = "";
				}
				else
				{
					tokenType = tokenTypeIdentifier;
				}
			
				tokens.push([tokenType, tokenText]);
				
				if(IsSpecialCharacter(c))
				{
					tokenText = "";
					tokenText += c;
					
					i++;
					
					parserState = parserStateSpecialWord;
				}
				else
				{
					parserState = parserStateOther;
				}
			}
			else
			{
				tokenText += c;
				i ++;
			}
			
		}
		else if(parserState == parserStateLiteral)		
		{
			if(!IsDigit(c))
			{
				tokens.push([tokenTypeLiteral, tokenText]);
				parserState = parserStateOther;
			}
			else
			{
				tokenText += c;
				i ++;
			}
			
		}
		else if(parserState == parserStateSpecialWord)
		{
			if(tokenText == tokenTextOpenRoundBracket)			{ tokens.push([tokenTypeOpenRoundBracket,		""]); tokenText = ""; }
			else if(tokenText == tokenTextOpenClaudator)		{ tokens.push([tokenTypeOpenClaudator, 			""]); tokenText = ""; }
			else if(tokenText == tokenTextOpenSquareBracket)	{ tokens.push([tokenTypeOpenSquareBracket, 		""]); tokenText = ""; }
			else if(!IsSpecialCharacter(c))
			{
				if(tokenText == tokenTextCloseRoundBracket)			{ tokens.push([tokenTypeCloseRoundBracket,		""]); }
				else if(tokenText == tokenTextAssign)				{ tokens.push([tokenTypeAssign,					""]); }
				else if(tokenText == tokenTextAddition)				{ tokens.push([tokenTypeAddition,				""]); }
				else if(tokenText == tokenTextMinus)				{ tokens.push([tokenTypeMinus,					""]); }
				else if(tokenText == tokenTextAsterisk)				{ tokens.push([tokenTypeAsterisk,				""]); }
				else if(tokenText == tokenTextDivision)				{ tokens.push([tokenTypeDivision,				""]); }
				else if(tokenText == tokenTextAsterisk)				{ tokens.push([tokenTypeAsterisk,				""]); }
				else if(tokenText == tokenTextGreater)				{ tokens.push([tokenTypeGreater,				""]); }
				else if(tokenText == tokenTextGreaterEqual)			{ tokens.push([tokenTypeGreaterEqual,			""]); }
				else if(tokenText == tokenTextLess)					{ tokens.push([tokenTypeLess,					""]); }
				else if(tokenText == tokenTextLessEqual)			{ tokens.push([tokenTypeLessEqual,				""]); }
				else if(tokenText == tokenTextEqual)				{ tokens.push([tokenTypeEqual,					""]); }
				else if(tokenText == tokenTextNotEqual)				{ tokens.push([tokenTypeNotEqual,				""]); }
				else if(tokenText == tokenTextCloseClaudator)		{ tokens.push([tokenTypeCloseClaudator, 		""]); }
				else if(tokenText == tokenTextComma)				{ tokens.push([tokenTypeComma, 					""]); }
				else if(tokenText == tokenTextCloseSquareBracket)	{ tokens.push([tokenTypeCloseSquareBracket,		""]); }
				else if(tokenText == tokenTextEndSentence)			{ tokens.push([tokenTypeEndSentence,			""]); }


				parserState = parserStateOther;
			}
			else
			{
				tokenText += c;
				i ++;				
			}
			
		}
		
	}
	
	if(error)
	{
		window.alert("ERROR: Linea " + line + " columna " + i + ": " + errorText);
		
		return null;
	}
	else
	{
		return tokens;
	}
	

}

function PrintTokens(tokens)
{
	var result = "";
	
	for(var i = 0; i < tokens.length; i ++)
	{
		result += i + ": " + TokenTypeName(tokens[i][0]) + (tokens[i][1].length > 0 ? ":" + tokens[i][1]: "") + "\n";
	}
	
	return result;
}

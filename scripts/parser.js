
var tokenTextDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var tokenTextCharacters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
							"k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
							"u", "v", "w", "x", "y", "z",
							"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
							"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
							"U", "V", "W", "X", "Y", "Z"];
							
var tokenTextSeparators = [" ", "\t", "\n"];

var tokenLineSeparator = "\n";


const tokenTextOpenRoundBracket		= "(";
const tokenTextCloseRoundBracket	= ")";
const tokenTextEqual 			= "=";
const tokenTextAddition 			= "+";
const tokenTextMinus				= "-";
const tokenTextAsterisk				= "*";
const tokenTextDivision				= "/";
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
const tokenTypeEqual			= 4;
const tokenTypeAddition				= 5;
const tokenTypeMinus				= 6;
const tokenTypeAsterisk				= 7;
const tokenTypeDivision				= 8;
const tokenTypeIf					= 9;
const tokenTypeElse					= 10;
const tokenTypeWhile				= 12;
const tokenTypeFor					= 13;
const tokenTypeOpenClaudator		= 14;
const tokenTypeCloseClaudator		= 15;
const tokenTypeAddressOf			= 16;
const tokenTypeComma				= 17;
const tokenTypeOpenSquareBracket	= 18;
const tokenTypeCloseSquareBracket	= 19;
const tokenTypeSeparator			= 20;
const tokenTypeEndSentence			= 21;


const parserStateWord = 0;
const parserStateLiteral = 1;
const parserStateSeparator = 2;
const parserStateOther = 3;

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
	if(type == tokenTypeLiteral)					{ return "Literal(LIT)"; }
	else if(type == tokenTypeOpenRoundBracket)      { return "RoundBracketOpen(RBO)"; }
	else if(type == tokenTypeCloseRoundBracket)     { return "RoundBracketClose(RBC)"; }
	else if(type == tokenTypeIdentifier)            { return "Identifier(ID)"; }
	else if(type == tokenTypeEqual)	                { return "Equal(EQ)"; }
	else if(type == tokenTypeAddition)              { return "Add(ADD)"; }
	else if(type == tokenTypeMinus)	                { return "Substract(SUB)"; }
	else if(type == tokenTypeAsterisk)              { return "Asterisk(AST)"; }
	else if(type == tokenTypeDivision)		        { return "Division(DIV)"; }
	else if(type == tokenTypeIf)	                { return "If(IF)"; }
	else if(type == tokenTypeElse)                  { return "Else(ELS)"; }
	else if(type == tokenTypeWhile)                 { return "While(WHL)"; }
	else if(type == tokenTypeFor)                   { return "For(FOR)"; }
	else if(type == tokenTypeOpenClaudator)         { return "ClaudatorOpen(CO)"; }
	else if(type == tokenTypeCloseClaudator)        { return "ClaudatorClose(CC)"; }
	else if(type == tokenTypeAddressOf)             { return "Address(ADR)"; }
	else if(type == tokenTypeComma)                 { return "Comma(COM)"; }
	else if(type == tokenTypeOpenSquareBracket)     { return "SquareBracketOpen(SBO)"; }
	else if(type == tokenTypeCloseSquareBracket)    { return "SquareBracketClose(SBC)"; }
	else if(type == tokenTypeSeparator)				{ return "Separator(SEP)"; }
	else if(type == tokenTypeEndSentence)			{ return "SentenceEnd(SND)"; }
	else { return "Unknown"; }
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
			else if(c == tokenTextOpenRoundBracket)		{ tokens.push([tokenTypeOpenRoundBracket,		""]); i++; }
			else if(c == tokenTextCloseRoundBracket)	{ tokens.push([tokenTypeCloseRoundBracket,		""]); i++; }
			else if(c == tokenTextEqual)				{ tokens.push([tokenTypeEqual,					""]); i++; }
			else if(c == tokenTextAddition)				{ tokens.push([tokenTypeAddition,				""]); i++; }
			else if(c == tokenTextMinus)				{ tokens.push([tokenTypeMinus,					""]); i++; }
			else if(c == tokenTextAsterisk)				{ tokens.push([tokenTypeAsterisk,				""]); i++; }
			else if(c == tokenTextDivision)				{ tokens.push([tokenTypeDivision,				""]); i++; }
			else if(c == tokenTextOpenClaudator)		{ tokens.push([tokenTypeOpenClaudator, 			""]); i++; }
			else if(c == tokenTextCloseClaudator)		{ tokens.push([tokenTypeCloseClaudator, 		""]); i++; }
			else if(c == tokenTextComma)				{ tokens.push([tokenTypeComma, 					""]); i++; }
			else if(c == tokenTextOpenSquareBracket)	{ tokens.push([tokenTypeOpenSquareBracket, 		""]); i++; }
			else if(c == tokenTextCloseSquareBracket)	{ tokens.push([tokenTypeCloseSquareBracket,		""]); i++; }
			else if(c == tokenTextEndSentence)			{ tokens.push([tokenTypeEndSentence,			""]); i++; }
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
			if(!IsCharacter(c) && !IsDigit(c))
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
				parserState = parserStateOther;
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
		
	}
	
	if(error)
	{
		console.log("ERROR: Linea " + line + " columna " + i + ": " + errorText);
		
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

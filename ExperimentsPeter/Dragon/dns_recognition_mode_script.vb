Option Explicit
' On Error Resume Next

Dim recMode
Dim controlEngine As DgnEngineControl
Sub Main
        ' Object var is Nothing error:
        ' controlEngine.RecognitionMode = DNSTools.dgnrecmodeLetters

        ' Default property usage is invalid:
        ' controlEngine.RecognitionMode(DNSTools.dgnrecmodeLetters)

        ' Spelmodus: DNSTools.dgnrecmodeLetters
        ' Controleer of DNSTools.dgnrecmodeLetters werkt en achterhaal de waarde:
        recMode = DNSTools.dgnrecmodeLetters
        MsgBox(recMode)
End Sub

' Notities:
' DgnEngineControl.RecognitionMode = DNSTools.dgnrecmodeLetters
' dgnEngine.RecognitionMode = DNSTools.DgnRecognitionModeConstants.dgnrecmodeLetters

' Als ik de Object Browser gebruik en de code invoer, krijg ik een error?:
' _DgnEngineControl.RecognitionMode = _DNSTools.DgnRecognitionModeConstants

' Dan verander ik dit naar het volgende, nog steeds een error:
' _DgnEngineControl.RecognitionMode = _DNSTools.dgnrecmodeLetters

' Dan verander ik dit naar de volgende code en nog steeds een error:
' DgnEngineControl.RecognitionMode = DNSTools.dgnrecmodeLetters

Dragon Scripting Notitie:
controlEngine() aanroepen?

https://www.nuance.com/products/help/dragon/dragon-for-pc/scriptref/Content/vbs/set_instruction.htm

Set Instruction
Syntax
Set objvar = objexpr
-or- 
Set objvar = New objtype

Group
Assignment

Description
Form 1: Set objvar's object reference to the object reference of objexpr. 

Form 2: Set objvar's object reference to the a new instance of objtype. 

The Set instruction is how object references are assigned.

Example
Sub Main 
Dim App As Object 
Set App = CreateObject("WinWrap.CppDemoApplication") 
App.Move 20,30 ' move icon to 20,30 
Set App = Nothing 
App.Quit ' run-time error (no object) 
End Sub

' Dwingt het declaren van variabelen af met Dim of ReDim:
Option Explicit
' On Error Resume Next

' Maak een Dimension aan van het type Object:
Dim DictationControl As Object
Sub Main
	' Verwijder eerst de eventueel aanwezige debug output:
	Debug.Clear

	' Creeer een Object en wijs dat toe aan de eerder aangemaakte Dimension:
	Set DictationControl = CreateObject("Dragon.DgnEngineControl")

	' Wijs een waarde toe aan de PROPERTY (of METHOD?) RecognitionMode:
	DictationControl.RecognitionMode = DNSTools.dgnrecmodeLetters

	' Object var is Nothing error:
	' controlEngine.RecognitionMode = DNSTools.dgnrecmodeLetters
	' DgnEngineControl.RecognitionMode(DNSTools.dgnrecmodeLetters)

	' Default property usage is invalid:
	' controlEngine.RecognitionMode(DNSTools.dgnrecmodeLetters)

	' DgnEngineControl.RecognitionMode = DNSTools.dgnrecmodeLetters
	' DgnEngineControl.RecognitionMode = DNSTools.DgnRecognitionModeConstants

	' DictationControl.RecognitionMode

	' Spelmodus: DNSTools.dgnrecmodeLetters
	' Controleer of DNSTools.dgnrecmodeLetters werkt en achterhaal de waarde:
	Debug.Print DNSTools.dgnrecmodeLetters
	Wait 3
End Sub

' Source: https://www.nuance.com/products/help/dragon/dragon-for-pc/scriptref/Content/vbs/createobject_function.htm

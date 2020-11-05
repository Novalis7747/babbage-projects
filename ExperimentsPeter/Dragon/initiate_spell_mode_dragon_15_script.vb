[ Postcode ]

Option Explicit ' Dwingt het declaren van variabelen af met Dim of ReDim.

Sub Main
	' Maak een Dimension aan van het type Object:
	Dim DictationControl As Object

	' Wis de Debug output van de console:
	Debug.Clear

	' Voeg een Error Handler toe om een melding te geven bij fouten:
	On Error GoTo ErrorHandler

	' Stuur de accesskey ALT + SHIFT + P door middels Dragon:
	SendDragonKeys "{Alt+Shift+P}"

	' Creeer voor een eerder aangemaakte Dimension een Object en wijs dat toe:
	Set DictationControl = CreateObject("Dragon.DgnEngineControl")

	' Wijs een waarde toe aan de PROPERTY RecognitionMode, mits
	' de RecognitionMode deze waarde al kent; doe dan niets:
	If DictationControl.RecognitionMode <> DNSTools.dgnrecmodeLetters Then
		DictationControl.RecognitionMode = DNSTools.dgnrecmodeLetters
	End If

	' Verlaat de Sub:
	Exit Sub

' Geef de foutcode terug in de console en wacht 3 seconden met doorgaan:
ErrorHandler:
	Debug.Print "Foutcode:" + " " + Err
	Wait 3
	Resume Next

End Sub

[ Voornaam, Straat, Adres, Woonplaats, Opmerking, Notitie ]

Option Explicit ' Dwingt het declaren van variabelen af met Dim of ReDim.

Sub Main
	' Maak een Dimension aan van het type Object:
	Dim DictationControl As Object

	' Wis de Debug output van de console:
	Debug.Clear

	' Voeg een Error Handler toe om een melding te geven bij fouten:
	On Error GoTo ErrorHandler

	' Stuur de accesskey ALT + SHIFT + W door middels Dragon:
	SendDragonKeys "{Alt+Shift+W}"

	' Creeer voor een eerder aangemaakte Dimension een Object en wijs dat toe:
	Set DictationControl = CreateObject("Dragon.DgnEngineControl")

	' Wijs een waarde toe aan de PROPERTY RecognitionMode, mits
	' de RecognitionMode deze waarde al kent; doe dan niets:
	If DictationControl.RecognitionMode <> DNSTools.dgnrecmodeNormal Then
		DictationControl.RecognitionMode = DNSTools.dgnrecmodeNormal
	End If

	' Verlaat de Sub:
	Exit Sub

' Geef de foutcode terug in de console en wacht 3 seconden met doorgaan:
ErrorHandler:
	Debug.Print "Foutcode:" + " " + Err
	Wait 3
	Resume Next

End Sub

[ Notities ]

' https://www.nuance.com/products/help/dragon/dragon-for-pc/scriptref/Content/vbs/createobject_function.htm
' https://docs.microsoft.com/en-us/dotnet/visual-basic/language-reference/statements/on-error-statement
' http://www.exaq.com/DNS/QR10/ScriptingReference.html
' http://www.cpearson.com/excel/Classes.aspx

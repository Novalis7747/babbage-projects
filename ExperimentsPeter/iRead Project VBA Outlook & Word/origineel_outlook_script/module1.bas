Attribute VB_Name = "module1"
Sub SaveAttachment()

    'Declaration
    Dim myItems, myItem, myAttachments, myAttachment As Object
    Dim myOrt As String
    Dim myOlApp As New Outlook.Application
    Dim myOlExp As Outlook.Explorer
    Dim myOlSel As Outlook.Selection

    'Ask for destination folder
    myOrt = InputBox("Destination", "Save Attachments", "C:\Users\Public\Documents\")

    On Error Resume Next

    'work on selected items
    Set myOlExp = myOlApp.ActiveExplorer
    Set myOlSel = myOlExp.Selection

    'for all items do...
    For Each myItem In myOlSel

        'point on attachments
        Set myAttachments = myItem.Attachments

        'if there are some...
        If myAttachments.Count > 0 Then

            'for all attachments do...
            For i = 1 To myAttachments.Count

                'save them to destination
                myAttachments(i).SaveAsFile myOrt & "output.pdf"
                
                'The following code will use the name of the attachment
                'myAttachments(i).SaveAsFile myOrt & _
                'myAttachments(i).DisplayName

            Next i

        End If

    Next

    'open program of choice
    Shell "C:\Program Files (x86)\Handy Tech\iRead\iRead.exe" & " " & myOrt & "output.pdf", vbNormalFocus

End Sub

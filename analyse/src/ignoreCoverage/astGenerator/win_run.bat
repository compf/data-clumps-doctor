set DESTINATION=%2%
echo "%DESTINATION%"
set SOURCE=%1%
echo %SOURCE%
set IGNORE_DUBLICATE_DEFINITION=%3%
set GENERATE_REFERENCES_OF_FIELDS_AND_METHODS=%4%
set IGNORE_WILDCARD_IMPORTS=%5%
.\pmd-bin-7.0.0-rc3/bin/pmd check -d "%SOURCE%" -f text -R custom-java-ruleset.xml

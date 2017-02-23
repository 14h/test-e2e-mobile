#!/bin/bash 
# runs same protractor tests against a list of urls

# optionally pass the name as cmdline parameter
MAGAZINE_FILE="magazines.live"
# repeat test suit up x times in case there is one failure
NUMBER_RETRY_TEST=3
# if a suite takes longer than this, assume it's dead and kill it
MAX_TIME_ONE_TEST="600"
REPORT_DIR="reports"

# cmdline handling
while [[ $# > 1 ]]
do
    key="$1"

    case $key in
        -m|--magazine-file)
            MAGAZINE_FILE="$2"
            shift
            ;;
        -r|--number-retry-test)
            NUMBER_RETRY_TEST="$2"
            shift
            ;;
        -t|--max-time-one-test)
            MAX_TIME_ONE_TEST="$2"
            shift
            ;;
        --)
            shift
            protractor_args="$@"
            break
            ;;
        *)
            echo "Unknown option: $key"
            exit 1
            ;;
    esac
    shift
done

echo "running magazine test..."
echo "  magazine source file: $MAGAZINE_FILE"
echo "  max retries: $NUMBER_RETRY_TEST"
echo "  max duration (s): $MAX_TIME_ONE_TEST"
echo "  protractor options: $protractor_args"


# timeout command is gtimeout on OS X
case $OSTYPE in
    darwin*)
        timeout_cmd=gtimeout
        ;;
    *)
        timeout_cmd=timeout
        ;;
esac


# exit program via CTRL-C
trap "exit" INT

repeat_up_to () {
	times=$1
	url=$2
	n=1
	
	until [[ $n -gt $times ]] ; do
        $timeout_cmd --preserve-status $MAX_TIME_ONE_TEST "$(npm bin)/protractor" --baseUrl="$url" $protractor_args liveTest.conf.js && break # success!
		# exit on error, for debug
		# echo $?
		# if [[ $? -ne 0 ]] ; then exit 1; fi
		echo "Test failed for $url $n times."	
		n=$[$n+1]
	done
}

total_no_mags=0
rm -rf $REPORT_DIR/*

while IFS='' read -r mag || [[ -n "$mag" ]]; do
	# remove comments starting with #
	mag=${mag%%#*}
	# ignore empty entries
	if [[ ! -z "$mag" ]] ; then
		echo "***********************************************"
		echo "Running test for $mag ..."
		echo
		repeat_up_to $NUMBER_RETRY_TEST $mag
        total_no_mags=$[$total_no_mags+1]
	fi
done < $MAGAZINE_FILE

echo "Done checking $total_no_mags magazines."

no_reports=`ls $REPORT_DIR -1 | wc --lines`

if [[ $total_no_mags -ne $no_reports ]]; then
    echo "Wrong number of reports created ($no_reports), probably too low timeout settings!"
    exit 1
fi



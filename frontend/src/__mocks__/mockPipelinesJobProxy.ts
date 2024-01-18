/* eslint-disable camelcase */
import {
  JobModeKF,
  PipelineRunJobKF,
  RelationshipKF,
  ResourceTypeKF,
} from '~/concepts/pipelines/kfTypes';

type MockResourceConfigType = {
  name?: string;
  id?: string;
};

export const mockPipelinesJobProxy = ({
  name = 'test-pipeline-run-job',
  id = 'test-pipeline-run-job',
}: MockResourceConfigType): PipelineRunJobKF => ({
  id,
  name,
  mode: JobModeKF.ENABLED,
  max_concurrency: '10',
  service_account: 'pipeline-runner-pipelines-definition',
  resource_references: [
    {
      key: {
        type: ResourceTypeKF.EXPERIMENT,
        id: 'f6348740-3954-4d55-a85d-ab83aef965c2',
      },
      name: 'Default',
      relationship: RelationshipKF.OWNER,
    },
    {
      key: {
        type: ResourceTypeKF.PIPELINE,
        id: '9f6619fb-63c6-41e4-b5d1-656fbf4d54e1',
      },
      name: '[Demo] flip-coin',
      relationship: RelationshipKF.CREATOR,
    },
  ],
  pipeline_spec: {
    workflow_manifest:
      'apiVersion: tekton.dev/v1beta1\nkind: PipelineRun\nmetadata:\n  name: conditional-execution-pipeline\n  annotations:\n    tekton.dev/output_artifacts: \'{"flip-coin": [{"key": "artifacts/$PIPELINERUN/flip-coin/Output.tgz",\n      "name": "flip-coin-Output", "path": "/tmp/outputs/Output/data"}], "random-num":\n      [{"key": "artifacts/$PIPELINERUN/random-num/Output.tgz", "name": "random-num-Output",\n      "path": "/tmp/outputs/Output/data"}], "random-num-2": [{"key": "artifacts/$PIPELINERUN/random-num-2/Output.tgz",\n      "name": "random-num-2-Output", "path": "/tmp/outputs/Output/data"}]}\'\n    tekton.dev/input_artifacts: \'{"print-msg": [{"name": "random-num-Output", "parent_task":\n      "random-num"}], "print-msg-2": [{"name": "random-num-Output", "parent_task":\n      "random-num"}], "print-msg-3": [{"name": "random-num-2-Output", "parent_task":\n      "random-num-2"}], "print-msg-4": [{"name": "random-num-2-Output", "parent_task":\n      "random-num-2"}]}\'\n    tekton.dev/artifact_bucket: mlpipeline\n    tekton.dev/artifact_endpoint: minio-service.kubeflow:9000\n    tekton.dev/artifact_endpoint_scheme: http://\n    tekton.dev/artifact_items: \'{"flip-coin": [["Output", "$(results.Output.path)"]],\n      "print-msg": [], "print-msg-2": [], "print-msg-3": [], "print-msg-4": [], "random-num":\n      [["Output", "$(results.Output.path)"]], "random-num-2": [["Output", "$(results.Output.path)"]]}\'\n    sidecar.istio.io/inject: "false"\n    tekton.dev/template: \'\'\n    pipelines.kubeflow.org/big_data_passing_format: $(workspaces.$TASK_NAME.path)/artifacts/$ORIG_PR_NAME/$TASKRUN_NAME/$TASK_PARAM_NAME\n    pipelines.kubeflow.org/pipeline_spec: \'{"description": "Shows how to use dsl.Condition().",\n      "name": "conditional-execution-pipeline"}\'\n  labels:\n    pipelines.kubeflow.org/pipelinename: \'\'\n    pipelines.kubeflow.org/generation: \'\'\nspec:\n  pipelineSpec:\n    tasks:\n    - name: flip-coin\n      taskSpec:\n        steps:\n        - name: main\n          args:\n          - \'----output-paths\'\n          - $(results.Output.path)\n          command:\n          - sh\n          - -ec\n          - |\n            program_path=$(mktemp)\n            printf "%s" "$0" > "$program_path"\n            python3 -u "$program_path" "$@"\n          - |\n            def flip_coin():\n                """Flip a coin and output heads or tails randomly."""\n                import random\n                result = \'heads\' if random.randint(0, 1) == 0 else \'tails\'\n                print(result)\n                return result\n\n            def _serialize_str(str_value: str) -> str:\n                if not isinstance(str_value, str):\n                    raise TypeError(\'Value "{}" has type "{}" instead of str.\'.format(\n                        str(str_value), str(type(str_value))))\n                return str_value\n\n            import argparse\n            _parser = argparse.ArgumentParser(prog=\'Flip coin\', description=\'Flip a coin and output heads or tails randomly.\')\n            _parser.add_argument("----output-paths", dest="_output_paths", type=str, nargs=1)\n            _parsed_args = vars(_parser.parse_args())\n            _output_files = _parsed_args.pop("_output_paths", [])\n\n            _outputs = flip_coin(**_parsed_args)\n\n            _outputs = [_outputs]\n\n            _output_serializers = [\n                _serialize_str,\n\n            ]\n\n            import os\n            for idx, output_file in enumerate(_output_files):\n                try:\n                    os.makedirs(os.path.dirname(output_file))\n                except OSError:\n                    pass\n                with open(output_file, \'w\') as f:\n                    f.write(_output_serializers[idx](_outputs[idx]))\n          image: python:alpine3.6\n        results:\n        - name: Output\n          type: string\n          description: /tmp/outputs/Output/data\n        metadata:\n          labels:\n            pipelines.kubeflow.org/cache_enabled: "true"\n          annotations:\n            pipelines.kubeflow.org/component_spec_digest: \'{"name": "Flip coin", "outputs":\n              [{"name": "Output", "type": "String"}], "version": "Flip coin@sha256=83ef617eda2e04a688908716a02461237baee3cd04754ea99894e441b1f0679a"}\'\n    - name: random-num\n      taskSpec:\n        steps:\n        - name: main\n          args:\n          - --low\n          - \'0\'\n          - --high\n          - \'9\'\n          - \'----output-paths\'\n          - $(results.Output.path)\n          command:\n          - sh\n          - -ec\n          - |\n            program_path=$(mktemp)\n            printf "%s" "$0" > "$program_path"\n            python3 -u "$program_path" "$@"\n          - |\n            def random_num(low, high):\n                """Generate a random number between low and high."""\n                import random\n                result = random.randint(low, high)\n                print(result)\n                return result\n\n            def _serialize_int(int_value: int) -> str:\n                if isinstance(int_value, str):\n                    return int_value\n                if not isinstance(int_value, int):\n                    raise TypeError(\'Value "{}" has type "{}" instead of int.\'.format(\n                        str(int_value), str(type(int_value))))\n                return str(int_value)\n\n            import argparse\n            _parser = argparse.ArgumentParser(prog=\'Random num\', description=\'Generate a random number between low and high.\')\n            _parser.add_argument("--low", dest="low", type=int, required=True, default=argparse.SUPPRESS)\n            _parser.add_argument("--high", dest="high", type=int, required=True, default=argparse.SUPPRESS)\n            _parser.add_argument("----output-paths", dest="_output_paths", type=str, nargs=1)\n            _parsed_args = vars(_parser.parse_args())\n            _output_files = _parsed_args.pop("_output_paths", [])\n\n            _outputs = random_num(**_parsed_args)\n\n            _outputs = [_outputs]\n\n            _output_serializers = [\n                _serialize_int,\n\n            ]\n\n            import os\n            for idx, output_file in enumerate(_output_files):\n                try:\n                    os.makedirs(os.path.dirname(output_file))\n                except OSError:\n                    pass\n                with open(output_file, \'w\') as f:\n                    f.write(_output_serializers[idx](_outputs[idx]))\n          image: python:alpine3.6\n        results:\n        - name: Output\n          type: string\n          description: /tmp/outputs/Output/data\n        metadata:\n          labels:\n            pipelines.kubeflow.org/cache_enabled: "true"\n          annotations:\n            pipelines.kubeflow.org/component_spec_digest: \'{"name": "Random num",\n              "outputs": [{"name": "Output", "type": "Integer"}], "version": "Random\n              num@sha256=da6efc3f1c1ef51912b3964a64b773aa38436116bb83f188a1a57ea6f1e6a541"}\'\n      when:\n      - input: $(tasks.condition-1.results.outcome)\n        operator: in\n        values:\n        - "true"\n    - name: print-msg\n      params:\n      - name: random-num-Output\n        value: $(tasks.random-num.results.Output)\n      taskSpec:\n        steps:\n        - name: main\n          args:\n          - --msg\n          - heads and $(inputs.params.random-num-Output) > 5!\n          command:\n          - sh\n          - -ec\n          - |\n            program_path=$(mktemp)\n            printf "%s" "$0" > "$program_path"\n            python3 -u "$program_path" "$@"\n          - |\n            def print_msg(msg):\n                """Print a message."""\n                print(msg)\n\n            import argparse\n            _parser = argparse.ArgumentParser(prog=\'Print msg\', description=\'Print a message.\')\n            _parser.add_argument("--msg", dest="msg", type=str, required=True, default=argparse.SUPPRESS)\n            _parsed_args = vars(_parser.parse_args())\n\n            _outputs = print_msg(**_parsed_args)\n          image: python:alpine3.6\n        params:\n        - name: random-num-Output\n        metadata:\n          labels:\n            pipelines.kubeflow.org/cache_enabled: "true"\n          annotations:\n            pipelines.kubeflow.org/component_spec_digest: \'{"name": "Print msg", "outputs":\n              [], "version": "Print msg@sha256=a13aed2f155afe0e8a1d1e29efc69b1cb1c3b170c45129f80ffe8d0a03a07861"}\'\n      when:\n      - input: $(tasks.condition-2.results.outcome)\n        operator: in\n        values:\n        - "true"\n    - name: print-msg-2\n      params:\n      - name: random-num-Output\n        value: $(tasks.random-num.results.Output)\n      taskSpec:\n        steps:\n        - name: main\n          args:\n          - --msg\n          - heads and $(inputs.params.random-num-Output) <= 5!\n          command:\n          - sh\n          - -ec\n          - |\n            program_path=$(mktemp)\n            printf "%s" "$0" > "$program_path"\n            python3 -u "$program_path" "$@"\n          - |\n            def print_msg(msg):\n                """Print a message."""\n                print(msg)\n\n            import argparse\n            _parser = argparse.ArgumentParser(prog=\'Print msg\', description=\'Print a message.\')\n            _parser.add_argument("--msg", dest="msg", type=str, required=True, default=argparse.SUPPRESS)\n            _parsed_args = vars(_parser.parse_args())\n\n            _outputs = print_msg(**_parsed_args)\n          image: python:alpine3.6\n        params:\n        - name: random-num-Output\n        metadata:\n          labels:\n            pipelines.kubeflow.org/cache_enabled: "true"\n          annotations:\n            pipelines.kubeflow.org/component_spec_digest: \'{"name": "Print msg", "outputs":\n              [], "version": "Print msg@sha256=a13aed2f155afe0e8a1d1e29efc69b1cb1c3b170c45129f80ffe8d0a03a07861"}\'\n      when:\n      - input: $(tasks.condition-3.results.outcome)\n        operator: in\n        values:\n        - "true"\n    - name: random-num-2\n      taskSpec:\n        steps:\n        - name: main\n          args:\n          - --low\n          - \'10\'\n          - --high\n          - \'19\'\n          - \'----output-paths\'\n          - $(results.Output.path)\n          command:\n          - sh\n          - -ec\n          - |\n            program_path=$(mktemp)\n            printf "%s" "$0" > "$program_path"\n            python3 -u "$program_path" "$@"\n          - |\n            def random_num(low, high):\n                """Generate a random number between low and high."""\n                import random\n                result = random.randint(low, high)\n                print(result)\n                return result\n\n            def _serialize_int(int_value: int) -> str:\n                if isinstance(int_value, str):\n                    return int_value\n                if not isinstance(int_value, int):\n                    raise TypeError(\'Value "{}" has type "{}" instead of int.\'.format(\n                        str(int_value), str(type(int_value))))\n                return str(int_value)\n\n            import argparse\n            _parser = argparse.ArgumentParser(prog=\'Random num\', description=\'Generate a random number between low and high.\')\n            _parser.add_argument("--low", dest="low", type=int, required=True, default=argparse.SUPPRESS)\n            _parser.add_argument("--high", dest="high", type=int, required=True, default=argparse.SUPPRESS)\n            _parser.add_argument("----output-paths", dest="_output_paths", type=str, nargs=1)\n            _parsed_args = vars(_parser.parse_args())\n            _output_files = _parsed_args.pop("_output_paths", [])\n\n            _outputs = random_num(**_parsed_args)\n\n            _outputs = [_outputs]\n\n            _output_serializers = [\n                _serialize_int,\n\n            ]\n\n            import os\n            for idx, output_file in enumerate(_output_files):\n                try:\n                    os.makedirs(os.path.dirname(output_file))\n                except OSError:\n                    pass\n                with open(output_file, \'w\') as f:\n                    f.write(_output_serializers[idx](_outputs[idx]))\n          image: python:alpine3.6\n        results:\n        - name: Output\n          type: string\n          description: /tmp/outputs/Output/data\n        metadata:\n          labels:\n            pipelines.kubeflow.org/cache_enabled: "true"\n          annotations:\n            pipelines.kubeflow.org/component_spec_digest: \'{"name": "Random num",\n              "outputs": [{"name": "Output", "type": "Integer"}], "version": "Random\n              num@sha256=da6efc3f1c1ef51912b3964a64b773aa38436116bb83f188a1a57ea6f1e6a541"}\'\n      when:\n      - input: $(tasks.condition-4.results.outcome)\n        operator: in\n        values:\n        - "true"\n    - name: print-msg-3\n      params:\n      - name: random-num-2-Output\n        value: $(tasks.random-num-2.results.Output)\n      taskSpec:\n        steps:\n        - name: main\n          args:\n          - --msg\n          - tails and $(inputs.params.random-num-2-Output) > 15!\n          command:\n          - sh\n          - -ec\n          - |\n            program_path=$(mktemp)\n            printf "%s" "$0" > "$program_path"\n            python3 -u "$program_path" "$@"\n          - |\n            def print_msg(msg):\n                """Print a message."""\n                print(msg)\n\n            import argparse\n            _parser = argparse.ArgumentParser(prog=\'Print msg\', description=\'Print a message.\')\n            _parser.add_argument("--msg", dest="msg", type=str, required=True, default=argparse.SUPPRESS)\n            _parsed_args = vars(_parser.parse_args())\n\n            _outputs = print_msg(**_parsed_args)\n          image: python:alpine3.6\n        params:\n        - name: random-num-2-Output\n        metadata:\n          labels:\n            pipelines.kubeflow.org/cache_enabled: "true"\n          annotations:\n            pipelines.kubeflow.org/component_spec_digest: \'{"name": "Print msg", "outputs":\n              [], "version": "Print msg@sha256=a13aed2f155afe0e8a1d1e29efc69b1cb1c3b170c45129f80ffe8d0a03a07861"}\'\n      when:\n      - input: $(tasks.condition-5.results.outcome)\n        operator: in\n        values:\n        - "true"\n    - name: print-msg-4\n      params:\n      - name: random-num-2-Output\n        value: $(tasks.random-num-2.results.Output)\n      taskSpec:\n        steps:\n        - name: main\n          args:\n          - --msg\n          - tails and $(inputs.params.random-num-2-Output) <= 15!\n          command:\n          - sh\n          - -ec\n          - |\n            program_path=$(mktemp)\n            printf "%s" "$0" > "$program_path"\n            python3 -u "$program_path" "$@"\n          - |\n            def print_msg(msg):\n                """Print a message."""\n                print(msg)\n\n            import argparse\n            _parser = argparse.ArgumentParser(prog=\'Print msg\', description=\'Print a message.\')\n            _parser.add_argument("--msg", dest="msg", type=str, required=True, default=argparse.SUPPRESS)\n            _parsed_args = vars(_parser.parse_args())\n\n            _outputs = print_msg(**_parsed_args)\n          image: python:alpine3.6\n        params:\n        - name: random-num-2-Output\n        metadata:\n          labels:\n            pipelines.kubeflow.org/cache_enabled: "true"\n          annotations:\n            pipelines.kubeflow.org/component_spec_digest: \'{"name": "Print msg", "outputs":\n              [], "version": "Print msg@sha256=a13aed2f155afe0e8a1d1e29efc69b1cb1c3b170c45129f80ffe8d0a03a07861"}\'\n      when:\n      - input: $(tasks.condition-6.results.outcome)\n        operator: in\n        values:\n        - "true"\n    - name: condition-1\n      params:\n      - name: operand1\n        value: $(tasks.flip-coin.results.Output)\n      - name: operand2\n        value: heads\n      - name: operator\n        value: ==\n      taskSpec:\n        results:\n        - name: outcome\n          type: string\n          description: Conditional task outcome\n        params:\n        - name: operand1\n        - name: operand2\n        - name: operator\n        steps:\n        - name: main\n          command:\n          - sh\n          - -ec\n          - program_path=$(mktemp); printf "%s" "$0" > "$program_path";  python3 -u\n            "$program_path" "$1" "$2"\n          args:\n          - |\n            import sys\n            input1=str.rstrip(sys.argv[1])\n            input2=str.rstrip(sys.argv[2])\n            try:\n              input1=int(input1)\n              input2=int(input2)\n            except:\n              input1=str(input1)\n            outcome="true" if (input1 $(inputs.params.operator) input2) else "false"\n            f = open("/tekton/results/outcome", "w")\n            f.write(outcome)\n            f.close()\n          - $(inputs.params.operand1)\n          - $(inputs.params.operand2)\n          image: python:alpine3.6\n    - name: condition-2\n      params:\n      - name: operand1\n        value: $(tasks.random-num.results.Output)\n      - name: operand2\n        value: \'5\'\n      - name: operator\n        value: \'>\'\n      taskSpec:\n        results:\n        - name: outcome\n          type: string\n          description: Conditional task outcome\n        params:\n        - name: operand1\n        - name: operand2\n        - name: operator\n        steps:\n        - name: main\n          command:\n          - sh\n          - -ec\n          - program_path=$(mktemp); printf "%s" "$0" > "$program_path";  python3 -u\n            "$program_path" "$1" "$2"\n          args:\n          - |\n            import sys\n            input1=str.rstrip(sys.argv[1])\n            input2=str.rstrip(sys.argv[2])\n            try:\n              input1=int(input1)\n              input2=int(input2)\n            except:\n              input1=str(input1)\n            outcome="true" if (input1 $(inputs.params.operator) input2) else "false"\n            f = open("/tekton/results/outcome", "w")\n            f.write(outcome)\n            f.close()\n          - $(inputs.params.operand1)\n          - $(inputs.params.operand2)\n          image: python:alpine3.6\n      when:\n      - input: $(tasks.condition-1.results.outcome)\n        operator: in\n        values:\n        - "true"\n    - name: condition-3\n      params:\n      - name: operand1\n        value: $(tasks.random-num.results.Output)\n      - name: operand2\n        value: \'5\'\n      - name: operator\n        value: <=\n      taskSpec:\n        results:\n        - name: outcome\n          type: string\n          description: Conditional task outcome\n        params:\n        - name: operand1\n        - name: operand2\n        - name: operator\n        steps:\n        - name: main\n          command:\n          - sh\n          - -ec\n          - program_path=$(mktemp); printf "%s" "$0" > "$program_path";  python3 -u\n            "$program_path" "$1" "$2"\n          args:\n          - |\n            import sys\n            input1=str.rstrip(sys.argv[1])\n            input2=str.rstrip(sys.argv[2])\n            try:\n              input1=int(input1)\n              input2=int(input2)\n            except:\n              input1=str(input1)\n            outcome="true" if (input1 $(inputs.params.operator) input2) else "false"\n            f = open("/tekton/results/outcome", "w")\n            f.write(outcome)\n            f.close()\n          - $(inputs.params.operand1)\n          - $(inputs.params.operand2)\n          image: python:alpine3.6\n      when:\n      - input: $(tasks.condition-1.results.outcome)\n        operator: in\n        values:\n        - "true"\n    - name: condition-4\n      params:\n      - name: operand1\n        value: $(tasks.flip-coin.results.Output)\n      - name: operand2\n        value: tails\n      - name: operator\n        value: ==\n      taskSpec:\n        results:\n        - name: outcome\n          type: string\n          description: Conditional task outcome\n        params:\n        - name: operand1\n        - name: operand2\n        - name: operator\n        steps:\n        - name: main\n          command:\n          - sh\n          - -ec\n          - program_path=$(mktemp); printf "%s" "$0" > "$program_path";  python3 -u\n            "$program_path" "$1" "$2"\n          args:\n          - |\n            import sys\n            input1=str.rstrip(sys.argv[1])\n            input2=str.rstrip(sys.argv[2])\n            try:\n              input1=int(input1)\n              input2=int(input2)\n            except:\n              input1=str(input1)\n            outcome="true" if (input1 $(inputs.params.operator) input2) else "false"\n            f = open("/tekton/results/outcome", "w")\n            f.write(outcome)\n            f.close()\n          - $(inputs.params.operand1)\n          - $(inputs.params.operand2)\n          image: python:alpine3.6\n    - name: condition-5\n      params:\n      - name: operand1\n        value: $(tasks.random-num-2.results.Output)\n      - name: operand2\n        value: \'15\'\n      - name: operator\n        value: \'>\'\n      taskSpec:\n        results:\n        - name: outcome\n          type: string\n          description: Conditional task outcome\n        params:\n        - name: operand1\n        - name: operand2\n        - name: operator\n        steps:\n        - name: main\n          command:\n          - sh\n          - -ec\n          - program_path=$(mktemp); printf "%s" "$0" > "$program_path";  python3 -u\n            "$program_path" "$1" "$2"\n          args:\n          - |\n            import sys\n            input1=str.rstrip(sys.argv[1])\n            input2=str.rstrip(sys.argv[2])\n            try:\n              input1=int(input1)\n              input2=int(input2)\n            except:\n              input1=str(input1)\n            outcome="true" if (input1 $(inputs.params.operator) input2) else "false"\n            f = open("/tekton/results/outcome", "w")\n            f.write(outcome)\n            f.close()\n          - $(inputs.params.operand1)\n          - $(inputs.params.operand2)\n          image: python:alpine3.6\n      when:\n      - input: $(tasks.condition-4.results.outcome)\n        operator: in\n        values:\n        - "true"\n    - name: condition-6\n      params:\n      - name: operand1\n        value: $(tasks.random-num-2.results.Output)\n      - name: operand2\n        value: \'15\'\n      - name: operator\n        value: <=\n      taskSpec:\n        results:\n        - name: outcome\n          type: string\n          description: Conditional task outcome\n        params:\n        - name: operand1\n        - name: operand2\n        - name: operator\n        steps:\n        - name: main\n          command:\n          - sh\n          - -ec\n          - program_path=$(mktemp); printf "%s" "$0" > "$program_path";  python3 -u\n            "$program_path" "$1" "$2"\n          args:\n          - |\n            import sys\n            input1=str.rstrip(sys.argv[1])\n            input2=str.rstrip(sys.argv[2])\n            try:\n              input1=int(input1)\n              input2=int(input2)\n            except:\n              input1=str(input1)\n            outcome="true" if (input1 $(inputs.params.operator) input2) else "false"\n            f = open("/tekton/results/outcome", "w")\n            f.write(outcome)\n            f.close()\n          - $(inputs.params.operand1)\n          - $(inputs.params.operand2)\n          image: python:alpine3.6\n      when:\n      - input: $(tasks.condition-4.results.outcome)\n        operator: in\n        values:\n        - "true"\n',
    runtime_config: {
      parameters: {},
      pipeline_root: '',
    },
  },
  trigger: {
    periodic_schedule: {
      start_time: '2023-08-31T20:35:00Z',
      end_time: '2023-09-07T20:35:00Z',
      interval_second: '604800',
    },
  },
  created_at: '2023-08-31T20:35:47Z',
  updated_at: '2023-09-22T17:11:32Z',
  status: 'Enabled',
  enabled: true,
  error: '',
  no_catchup: false,
});
